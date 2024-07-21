import { ApiResponseProperty } from '@nestjs/swagger';
import { Seat } from '@prisma/client';
export class GetSeatsByConcertIdResponseDto {
  @ApiResponseProperty({
    type: [],
  })
  seats: Seat[];

  static fromSeats(seats: Seat[]): GetSeatsByConcertIdResponseDto {
    const dto = new GetSeatsByConcertIdResponseDto();
    dto.seats = seats;
    return dto;
  }
}
