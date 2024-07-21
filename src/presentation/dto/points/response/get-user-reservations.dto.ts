import { ApiResponseProperty } from '@nestjs/swagger';
import { ReservationStatusDto } from '../../concerts/dto/response/reservation-status.dto';

export class GetUserReservationsResponseDto {
  @ApiResponseProperty({
    type: [ReservationStatusDto],
  })
  reservations: ReservationStatusDto[];

  static fromReservations(
    reservations: ReservationStatusDto[],
  ): GetUserReservationsResponseDto {
    const dto = new GetUserReservationsResponseDto();

    dto.reservations = reservations;

    return dto;
  }
}
