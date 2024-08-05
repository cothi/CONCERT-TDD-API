import { QueueEntry } from '@prisma/client';
import {
  CountWaitingAheadModel,
  CreateEnqueueModel,
  GetQueueEntryByUserIdModel,
  GetWaitingEntriesModel,
  QueueModel,
  RemoveQueueByIdModel,
} from 'src/domain/enqueue/model/enqueue.model';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import {
  CountWaitingAheadEntity,
  CreateQueueEntity,
  GetQueueByUserIdEntity,
  GetWaitingQueueByLimitEntity,
  RemoveQueueByIdEntity,
} from '../entity/queue.entity';

export class QueueMapper {
  static toMapCreateQueueEntiry(
    model: CreateEnqueueModel,
    tx?: PrismaTransaction,
  ): CreateQueueEntity {
    const entity = new CreateQueueEntity();
    entity.userId = model.userId;
    return entity;
  }
  static toMapGetQueueByUserIdEntity(
    model: GetQueueEntryByUserIdModel,
    tx?: PrismaTransaction,
  ): GetQueueByUserIdEntity {
    const entity = new GetQueueByUserIdEntity();
    entity.userId = model.userId;
    return entity;
  }
  static toMapRemoveQueueByIdEntity(
    model: RemoveQueueByIdModel,
  ): RemoveQueueByIdEntity {
    const entity = new RemoveQueueByIdEntity();
    entity.id = model.id;
    return entity;
  }

  static toMapCountWaitingAheadEntity(
    model: CountWaitingAheadModel,
  ): CountWaitingAheadEntity {
    const entity = new CountWaitingAheadEntity();
    entity.enteredAt = model.enteredAt;
    return entity;
  }
  static toMapGetWaitingQueueByLimitEntity(
    model: GetWaitingEntriesModel,
  ): GetWaitingQueueByLimitEntity {
    const entity = new GetWaitingQueueByLimitEntity();
    entity.limit = model.limit;
    return entity;
  }
  static toMapQueueModel(entity: QueueEntry): QueueModel {
    if (!entity) return null;
    const model = new QueueModel();
    model.status = entity.status;
    model.userId = entity.userId;
    return model;
  }

  static toMapQueueModels(entities: QueueEntry[]): QueueModel[] {
    return entities.map((entity) => this.toMapQueueModel(entity));
  }
}
