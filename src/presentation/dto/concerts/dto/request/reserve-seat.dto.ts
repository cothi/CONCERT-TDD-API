import { ApiProperty } from '@nestjs/swagger';

export class ReserveSeatDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '좌석 ID',
  })
  seatId: string;
}
