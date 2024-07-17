import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReserveSeatDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '좌석 ID',
  })
  @IsString()
  seatId: string;
}
