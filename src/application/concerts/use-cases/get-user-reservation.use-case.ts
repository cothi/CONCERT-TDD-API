import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { GetUserReservationsModel } from 'src/domain/concerts/model/reservation.model';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { GetUserReservationsResponseDto } from 'src/presentation/dto/points/response/get-user-reservations.dto';
import { GetUserReservationCommand } from '../command/get-user-reservation.command';

@Injectable()
export class GetUserReservationsUseCase
  implements
    IUseCase<GetUserReservationCommand, GetUserReservationsResponseDto>
{
  constructor(private reservationService: ReservationService) {}

  async execute(
    cmd: GetUserReservationCommand,
  ): Promise<GetUserReservationsResponseDto> {
    try {
      const model: GetUserReservationsModel = {
        userId: cmd.userId,
      };
      const reservations =
        await this.reservationService.getUserReservations(model);
      return GetUserReservationsResponseDto.fromReservations(reservations);
    } catch (error) {
      throw error;
    }
  }
}
