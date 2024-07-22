import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PaymentType,
  ReservationStatus,
  SeatStatus,
  TransactionType,
} from '@prisma/client';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { GetReservationByIdModel } from 'src/domain/concerts/model/reservation.model';
import {
  GetSeatBySeatIdModel,
  UpdateSeatStatusModel,
} from 'src/domain/concerts/model/seat.model';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { TransactionService } from 'src/domain/payment/services/transaction.service';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PaymentResponseDto } from 'src/presentation/dto/payment/response/payment.response.dto';
import { ProcessPaymentCommand } from '../command/process-payment.command';
import { UpdateReservationModel } from './../../../domain/concerts/model/reservation.model';
import { CreateTransactionModel } from 'src/domain/payment/model/transaction.model';
import { DeductPointModel } from 'src/domain/points/model/point-wallet.model';
import { RecordPaymentModel } from 'src/domain/points/model/payment.model';

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

  async execute(cmd: ProcessPaymentCommand): Promise<PaymentResponseDto> {
    try {
      const resultDto: PaymentResponseDto = await this.prisma.$transaction(
        async (prisma) => {
          try {
            // 예약 상태 확인
            const getReservationByIdModel = GetReservationByIdModel.create(
              cmd.reservationId,
            );
            const reservation =
              await this.reservationService.getReservationByWithLock(
                getReservationByIdModel,
                prisma,
              );

            if (
              reservation.status !== ReservationStatus.PENDING ||
              reservation.userId !== cmd.userId
            ) {
              throw new HttpException(
                '현재 예약 결제가 가능하지 않습니다.',
                HttpStatus.UNAUTHORIZED,
              );
            }

            const findSeatModel = GetSeatBySeatIdModel.create(
              reservation.seatId,
            );
            const seat = await this.seatService.getSeatBySeatId(
              findSeatModel,
              prisma,
            );
            // 포인트 차감
            const deductModel = DeductPointModel.create(cmd.userId, seat.price);
            await this.pointService.deductPoints(deductModel, prisma);

            // 좌석 상태 업데이트
            const updateModel = UpdateSeatStatusModel.create(
              reservation.seatId,
              SeatStatus.SOLD,
            );
            await this.seatService.updateSeatStatus(updateModel, prisma);

            // 예약 상태 업데이트
            const updateReservationModel = UpdateReservationModel.create(
              ReservationStatus.CONFIRMED,
              reservation.reservationId,
            );
            await this.reservationService.updateStatus(
              updateReservationModel,
              prisma,
            );

            // 결제 기록 생성
            const recordModel = RecordPaymentModel.create(
              seat.price,
              cmd.userId,
              PaymentType.TICKET_PURCHASE,
            );
            const payment =
              await this.pointTransactionService.recordPaymentHistory(
                recordModel,
                prisma,
              );

            // 트랜잭션 기록 생성
            const createTransactionModel = CreateTransactionModel.create(
              cmd.userId,
              seat.price,
              TransactionType.PAYMENT,
            );
            await this.transactionService.createTransaction(
              createTransactionModel,
              prisma,
            );

            return PaymentResponseDto.fromModel(
              payment,
              reservation,
              seat,
              true,
              '결제가 성공적으로 처리되었습니다.',
            );
          } catch (error) {
            throw error;
          }
        },
      );
      return resultDto;
    } catch (error) {
      throw error;
    }
  }
}
