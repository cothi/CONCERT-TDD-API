import { ApiResponseProperty } from '@nestjs/swagger';
import { ReservationList } from 'src/application/concerts/types/concerts.types';
import { ReservationStatusDto } from '../../concerts/dto/response/reservation-status.dto';

export class GetUserReservationsResponseDto {
  @ApiResponseProperty({
    type: [ReservationStatusDto],
  })
  reservations: ReservationStatusDto[];

  static fromReservations(
    reservations: ReservationList,
  ): GetUserReservationsResponseDto {
    const dto = new GetUserReservationsResponseDto();
    dto.reservations = this.fromReservatinonModels(reservations);
    return dto;
  }

  private static fromReservatinonModels(models: ReservationList) {
    const reservationArray = models.map((reservation) => ({
      id: reservation.id,
      concertName: reservation.concert.name,
      seatNumber: reservation.seat.seatNumber,
      reservationDate: reservation.concertDate.date,
      status: reservation.status,
    }));
    return reservationArray;
  }
}
