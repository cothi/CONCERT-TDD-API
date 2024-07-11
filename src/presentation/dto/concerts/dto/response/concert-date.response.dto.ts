import { ApiProperty } from '@nestjs/swagger';

export class ConcertDateResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '콘서트 날짜 ID',
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '콘서트 ID',
  })
  concertId: string;

  @ApiProperty({
    example: '2021-08-01T14:00:00Z',
    description: '콘서트 날짜 및 시간',
  })
  date: Date;

  @ApiProperty({
    example: 100,
    description: '전체 좌석 수',
  })
  totalSeat: number;

  @ApiProperty({
    example: 50,
    description: '이용 가능한 좌석 수',
  })
  availableSeatCount: number;
}
