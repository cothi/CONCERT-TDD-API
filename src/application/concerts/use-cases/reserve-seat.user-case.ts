import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReservationStatus, SeatStatus } from '@prisma/client';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { GCDByConcertDateIdModel } from 'src/domain/concerts/model/concert-date.model';
import { CreateReservationModel } from 'src/domain/concerts/model/reservation.model';
import {
  GetSeatBySeatIdModel,
  UpdateSeatStatusModel,
} from 'src/domain/concerts/model/seat.model';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { ReserveSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/reserve-seat.response.dto';
import { ReserveSeatCommand } from '../command/reserve-seat.command';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';

@Injectable()
export class ReserveSeatUseCase
  implements IUseCase<ReserveSeatCommand, ReserveSeatResponseDto>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly seatService: SeatService,
    private readonly reservationService: ReservationService,
    private readonly concertDateService: ConcertDateService,
    private readonly redisService: RedisService,
  ) {}
  async execute(cmd: ReserveSeatCommand): Promise<ReserveSeatResponseDto> {
    let lock: any;
    try {
      lock = this.redisService.acquireLock(cmd.userId);
    } catch (error) {
      throw error;
    } finally {
      try {
        const res = await this.prismaService.$transaction(async (prisma) => {
          // 1. 좌석 확인 및 락 획득
          const getSeatModel = GetSeatBySeatIdModel.create(cmd.seatId);
          const seat = await this.seatService.findAndLockSeat(
            getSeatModel,
            prisma,
          );

          if (seat.status !== SeatStatus.AVAILABLE) {
            throw new HttpException(
              'Seat is not available',
              HttpStatus.FORBIDDEN,
            );
          }

          const getConcertModel = GCDByConcertDateIdModel.create(
            seat.concertDateId,
          );
          const concertDate =
            await this.concertDateService.getConcertDateByConcertDateId(
              getConcertModel,
              prisma,
            );
          // 2. 좌석 예약

          const time = new Date(Date.now() + 1000 * 60 * 5);
          const createReservationModel = CreateReservationModel.create(
            cmd.userId,
            cmd.seatId,
            seat.concertDateId,
            concertDate.concertId,
            ReservationStatus.PENDING,
            time,
          );
          const reservation = await this.reservationService.createReservation(
            createReservationModel,
            prisma,
          );

          // 3. 좌석 상태 업데이트
          const updateModel = UpdateSeatStatusModel.create(
            seat.seatId,
            SeatStatus.RESERVED,
          );
          await this.seatService.updateSeatStatus(updateModel, prisma);

          return ReserveSeatResponseDto.fromReservation(reservation);
        });
        return res;
      } catch (error) {
        throw error;
      } finally {
        this.redisService.releaseLock(lock);
      }
    }
  }
}
