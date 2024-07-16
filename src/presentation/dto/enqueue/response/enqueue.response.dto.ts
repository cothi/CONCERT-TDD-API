import { ApiProperty } from '@nestjs/swagger';
import { QueueEntryStatus } from '@prisma/client';

export class EnqueueResponseDto {
  @ApiProperty({
    description: '현재 대기열 상태',
    enum: QueueEntryStatus,
    example: QueueEntryStatus.WAITING,
  })
  status: QueueEntryStatus;

  @ApiProperty({
    description: '대기열 진입 시간',
    example: '2023-07-12T09:00:00Z',
  })
  enteredAt: Date;
}
