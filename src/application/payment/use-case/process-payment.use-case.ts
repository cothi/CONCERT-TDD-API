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
import { PaymentResponseDto } from 'src/presentation/dto/payment/response/payment.response.dto';
import { ProcessPaymentCommand } from '../command/process-paymnet.command';
import { UpdateReservationModel } from './../../../domain/concerts/model/reservation.model';
import { IUseCase } from 'src/common/interfaces/use-case.interface';

@Injectable()
export class ProcessPaymentUseCase
  implements IUseCase<ProcessPaymentCommand, PaymentResponseDto>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointService: PointWalletService,
    private readonly pointTransactionService: PointTransactionService,
    private readonly reservationService: ReservationService,
    private readonly seatService: SeatService,
    private readonly transactionService: TransactionService,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<PaymentResponseDto> {
    const resultDto: PaymentResponseDto = await this.prisma.$transaction(
      async (prisma) => {
        try {
          // 예약 상태 확인
          const getReservationByIdModel: GetReservationByIdModel = {
            reservationId: command.reservationId,
          };
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
          // 포인트 차감
          await this.pointService.deductPoints(command.userId, seat.price);

          // 좌석 상태 업데이트
          const updateModel: UpdateSeatStatusModel = {
            seatId: reservation.seatId,
            status: SeatStatus.SOLD,
          };
          await this.seatService.updateSeatStatus(updateModel, prisma);

          // 예약 상태 업데이트
          const updateReservationModel: UpdateReservationModel = {
            reservationId: reservation.id,
            status: ReservationStatus.CONFIRMED,
          };
          await this.reservationService.updateStatus(
            updateReservationModel,
            prisma,
          );

          // 결제 기록 생성
          const payment =
            await this.pointTransactionService.recordPaymentHistory({
              userId: command.userId,
              amount: seat.price,
              type: PaymentType.TICKET_PURCHASE,
            });

          // 트랜잭션 기록 생성
          await this.transactionService.createTransaction(
            {
              userId: command.userId,
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
        } catch (error) {
          throw error;
        }
      },
    );
    return resultDto;
  }
}
