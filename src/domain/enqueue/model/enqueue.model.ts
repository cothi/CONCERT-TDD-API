import { PickType } from '@nestjs/swagger';
import { QueueEntryStatus } from '@prisma/client';

export class QueueModel {
  userId: string;
  position: number;
  status: QueueEntryStatus;

  static create(
    userId: string,
    status: QueueEntryStatus,
    position: number,
  ): QueueModel {
    const model = new QueueModel();
    model.status = status;
    model.userId = userId;
    model.position = position;
    return model;
  }
}
export class CreateEnqueueModel extends PickType(QueueModel, [
  'userId',
  'position',
]) {
  static create(userId: string, position: number): CreateEnqueueModel {
    const model = new CreateEnqueueModel();
    model.userId = userId;
    model.position = position;
    return model;
  }
}

export class GetQueueEntryByUserIdModel extends PickType(QueueModel, [
  'userId',
]) {
  static create(userId: string): GetQueueEntryByUserIdModel {
    const model = new GetQueueEntryByUserIdModel();
    model.userId = userId;
    return model;
  }
}

export class RemoveQueueByIdModel extends PickType(QueueModel, []) {
  static create(id: string): RemoveQueueByIdModel {
    const model = new RemoveQueueByIdModel();
    return model;
  }
}

export class CountWaitingAheadModel extends PickType(QueueModel, []) {
  static create(enteredAt: Date): CountWaitingAheadModel {
    const model = new CountWaitingAheadModel();
    return model;
  }
}

export class GetWaitingEntriesModel {
  limit: number;

  static create(limit: number): GetWaitingEntriesModel {
    const model = new GetWaitingEntriesModel();
    model.limit = limit;
    return model;
  }
}
