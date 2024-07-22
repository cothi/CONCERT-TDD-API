import { ApiResponseProperty } from '@nestjs/swagger';
import { SeatModel } from 'src/domain/concerts/model/seat.model';
export class GetSeatsByConcertIdResponseDto {
  @ApiResponseProperty({
    type: [],
  })
  seats: SeatModel[];

  static fromSeats(seats: SeatModel[]): GetSeatsByConcertIdResponseDto {
    const dto = new GetSeatsByConcertIdResponseDto();
    dto.seats = seats;
    return dto;
  }
}
