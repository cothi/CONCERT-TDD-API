import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, Min, Max } from 'class-validator';

export class CreateConcertDateDto {
  @ApiProperty({
    example: '2023-08-15',
    description: '콘서트 날짜 및 시간',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    example: 1000,
    description: '총 좌석 수',
  })
  @IsInt()
  @Min(1)
  @Max(100000)
  totalSeat: number;
}
