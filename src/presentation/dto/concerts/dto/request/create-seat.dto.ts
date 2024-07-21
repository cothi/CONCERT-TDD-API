import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({
    example: 1,
    description: '좌석 번호',
  })
  @IsInt()
  @Min(1)
  seatNumber: number;

  @ApiProperty({
    example: 50000,
    description: '좌석 가격',
  })
  @IsNumber()
  @Min(0)
  price: number;
}
