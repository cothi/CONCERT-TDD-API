import { PickType } from '@nestjs/swagger';
import { QueueEntryStatus } from '@prisma/client';

export class QueueEntity {
  id: string;
  status: QueueEntryStatus;
  userId: string;
  enteredAt: Date;
}
export class CreateQueueEntity extends PickType(QueueEntity, ['userId']) {}
export class GetQueueByUserIdEntity extends PickType(QueueEntity, ['userId']) {}
export class RemoveQueueByIdEntity extends PickType(QueueEntity, ['id']) {}
export class UpdateStatusEntity extends PickType(QueueEntity, [
  'id',
  'status',
]) {}
export class GetWaitingQueueByLimitEntity {
  limit: number;
}
export class CountWaitingAheadEntity extends PickType(QueueEntity, [
  'enteredAt',
]) {}
