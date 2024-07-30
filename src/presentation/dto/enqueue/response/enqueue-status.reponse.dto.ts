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
    description: '현재 대기열 위치',
    example: 10,
  })
  position: number;

  static create(
    status: QueueEntryStatus,
    position: number,
  ): QueueStatusResponseDto {
    const model = new QueueStatusResponseDto();
    model.status = status;
    model.position = position;
    return model;
  }
}
