import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/application/auth/interfaces/use-case.interface';
import { ReserveSeatCommand } from '../command/reserve-seat.command';
import { ReserveSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/reserve-seat.response.dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ReservationStatus, SeatStatus } from '@prisma/client';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';

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
      const seat = await this.seatService.findAndLockSeat(prisma, input.seatId);

      if (!seat || seat.status !== SeatStatus.AVAILABLE) {
        throw new Error('Seat is not available');
      }

      const concertDate =
        await this.concertDateService.getConcertDateByConcertDateId(
          seat.concertDateId,
        );
      // 2. 좌석 예약
      const reservation = await this.reservationService.createReservation(
        input.userId,
        input.seatId,
        seat.concertDateId,
        concertDate.concertId,
        ReservationStatus.PENDING,
        prisma,
      );

      // 3. 좌석 상태 업데이트
      await this.seatService.updateSeatStatus(
        seat.id,
        SeatStatus.RESERVED,
        prisma,
      );

      const dto = new ReserveSeatResponseDto();
      dto.createdAt = reservation.createdAt;
      dto.expiresAt = reservation.expiresAt;
      dto.id = reservation.id;
      dto.seatId = reservation.seatId;
      dto.status = reservation.status;
      dto.userId = reservation.userId;
      return dto;
    });
  }
}
