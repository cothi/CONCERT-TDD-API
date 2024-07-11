import { ApiProperty } from '@nestjs/swagger';
export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
}

export class SeatResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '좌석 ID',
  })
  id: string;

  @ApiProperty({
    example: 1,
    description: '좌석 번호',
  })
  seatNumber: number;

  @ApiProperty({
    example: 50000,
    description: '좌석 가격',
  })
  price: number;

  @ApiProperty({
    enum: SeatStatus,
    example: SeatStatus.AVAILABLE,
    description: '좌석 상태',
  })
  status: SeatStatus;

  @ApiProperty({
    example: '456e7890-e89b-12d3-a456-426614174000',
    description: '콘서트 날짜 ID',
  })
  concertDateId: string;
}
