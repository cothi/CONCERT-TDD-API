import { Injectable } from '@nestjs/common';
import { ReservationStatus, SeatStatus } from '@prisma/client';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { GCDByConcertDateIdModel } from 'src/domain/concerts/model/concert-date.model';
import { CreateReservationModel } from 'src/domain/concerts/model/reservation.model';
import { UpdateSeatStatusModel } from 'src/domain/concerts/model/seat.model';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ReserveSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/reserve-seat.response.dto';
import { ReserveSeatCommand } from '../command/reserve-seat.command';

@Injectable()
export class ReserveSeatUseCase
  implements IUseCase<ReserveSeatCommand, ReserveSeatResponseDto>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly seatService: SeatService,
    private readonly reservationService: ReservationService,
    private readonly concertDateService: ConcertDateService,
  ) {}
  async execute(input: ReserveSeatCommand): Promise<ReserveSeatResponseDto> {
    return this.prismaService.$transaction(async (prisma) => {
      // 1. 좌석 확인 및 락 획득
      const seat = await this.seatService.findAndLockSeat(input.seatId, prisma);

      if (!seat || seat.status !== SeatStatus.AVAILABLE) {
        throw new Error('Seat is not available');
      }

      const getConcertModel: GCDByConcertDateIdModel = {
        concertDateId: seat.concertDateId,
      };
      const concertDate =
        await this.concertDateService.getConcertDateByConcertDateId(
          getConcertModel,
          prisma,
        );
      // 2. 좌석 예약
      const createReservationModel: CreateReservationModel = {
        userId: input.userId,
        seatId: input.seatId,
        concertDateId: seat.concertDateId,
        concertId: concertDate.concertId,
        status: ReservationStatus.PENDING,
        expireAt: new Date(Date.now() + 1000 * 60 * 5), // 10분
      };
      const reservation = await this.reservationService.createReservation(
        createReservationModel,
        prisma,
      );

      // 3. 좌석 상태 업데이트
      const updateModel: UpdateSeatStatusModel = {
        seatId: seat.id,
        status: SeatStatus.RESERVED,
      };
      await this.seatService.updateSeatStatus(updateModel, prisma);

      return ReserveSeatResponseDto.fromReservation(reservation);
    });
  }
}
