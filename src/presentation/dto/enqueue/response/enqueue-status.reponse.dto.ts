import { ApiProperty } from '@nestjs/swagger';
import { QueueEntryStatus } from '@prisma/client';

export class QueueStatusResponseDto {
  @ApiProperty({
    description: '현재 대기열 상태',
    enum: QueueEntryStatus,
    example: QueueEntryStatus.WAITING,
  })
  status: QueueEntryStatus;

  @ApiProperty({
    description: '현재 예약 가능 여부',
    example: false,
  })
  isEligibleForReservation: boolean;

  @ApiProperty({
    description: '사용자 앞에 대기 중인 사람 수',
    example: 10,
  })
  queuedAhead: number;

  @ApiProperty({
    description: '대기열 진입 시간',
    example: '2023-07-12T09:00:00Z',
  })
  enteredAt: Date;

  @ApiProperty({
    description: '대기열 만료 시간 (해당되는 경우)',
    example: '2023-07-12T09:05:00Z',
    required: false,
  })
  expiresAt?: Date;
}
