import { Injectable } from '@nestjs/common';
import {
  PaymentType,
  ReservationStatus,
  SeatStatus,
  TransactionType,
} from '@prisma/client';
import { GetReservationByIdModel } from 'src/domain/concerts/model/reservation.model';
import { UpdateSeatStatusModel } from 'src/domain/concerts/model/seat.model';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { TransactionService } from 'src/domain/payment/transaction.service';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ProcessPaymentDto } from 'src/presentation/dto/payment/request/process-payment.dto';
import { PaymentResponseDto } from 'src/presentation/dto/payment/response/payment.response.dto';
import { UpdateReservationModel } from './../../../domain/concerts/model/reservation.model';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointService: PointWalletService,
    private readonly pointTransactionService: PointTransactionService,
    private readonly reservationService: ReservationService,
    private readonly seatService: SeatService,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(dto: ProcessPaymentDto): Promise<PaymentResponseDto> {
    const resultDto: PaymentResponseDto = await this.prisma.$transaction(
      async (prisma) => {
        // 사용자 포인트 확인
        const userPoint = await this.pointService.getBalance({
          userId: dto.userId,
        });

        // 예약 상태 확인
        const getReservationByIdModel = new GetReservationByIdModel(
          dto.reservationId,
        );
        const reservation = await this.reservationService.getReservationById(
          getReservationByIdModel,
          prisma,
        );
        if (reservation.status !== ReservationStatus.PENDING) {
          throw new Error('현재 예약 결제가 가능하지 않습니다.');
        }

        const seat = await this.seatService.getSeatBySeatId(
          reservation.seatId,
          prisma,
        );
        if (userPoint < seat.price) {
          throw new Error('포인트가 부족합니다.');
        }

        // 좌석 상태 업데이트
        const updateModel: UpdateSeatStatusModel = {
          seatId: reservation.seatId,
          status: SeatStatus.SOLD,
        };
        await this.seatService.updateSeatStatus(updateModel, prisma);

        // 예약 상태 업데이트
        const updateReservationModel = new UpdateReservationModel(
          reservation.id,
          ReservationStatus.CONFIRMED,
        );
        await this.reservationService.updateStatus(
          updateReservationModel,
          prisma,
        );

        // 포인트 차감
        await this.pointService.deductPoints(dto.userId, seat.price);

        // 결제 기록 생성
        const payment = await this.pointTransactionService.recordPaymentHistory(
          {
            userId: dto.userId,
            amount: seat.price,
            type: PaymentType.TICKET_PURCHASE,
          },
        );

        // 트랜잭션 기록 생성
        await this.transactionService.createTransaction(
          {
            userId: dto.userId,
            amount: seat.price,
            transactionType: TransactionType.PAYMENT,
          },
          prisma,
        );

        return {
          paymentId: payment.id,
          userId: payment.userId,
          amount: payment.amount,
          paymentType: payment.paymentType,
          createdAt: payment.createdAt,
          reservationId: reservation.id,
          reservationStatus: reservation.status,
          seatId: seat.id,
          seatStatus: seat.status,
          success: true,
          message: '결제가 성공적으로 처리되었습니다.',
        };
      },
    );
    return resultDto;
  }
}
