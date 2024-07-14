// src/dtos/reservation-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';

export class ReservationStatusDto {
  @ApiProperty({
    description: '예약의 고유 식별자',
    example: 'res_123456789'
  })
  id: string;

  @ApiProperty({
    description: '공연 이름',
    example: '2023 여름 록 페스티벌'
  })
  concertName: string;

  @ApiProperty({
    description: '좌석 번호',
    example: 'A-15'
  })
  seatNumber: number;

  @ApiProperty({
    description: '예약 날짜',
    example: '2023-07-15T09:30:00Z'
  })
  reservationDate: Date;

  @ApiProperty({
    description: '예약 상태',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED
  })
  status: ReservationStatus;
}