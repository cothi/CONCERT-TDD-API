import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
import { QueueEntryRepository } from 'src/infrastructure/enqueue/repository/queue.repository';
import { QueueModel } from '../model/enqueue.model';
import { QueueEntryStatus } from '@prisma/client';

@Injectable()
export class QueueService {
  constructor(private readonly queueEntryRepository: QueueEntryRepository) {}

  async enqueue(userId: string): Promise<number> {
    const position = await this.queueEntryRepository.getQueuePosition(userId);
    const status =
      await this.queueEntryRepository.getReservationPermission(userId);
    if (position !== null || status) {
      throw ErrorFactory.createException(ErrorCode.QUEUE_ALREADY_EXISTS);
    }

    return await this.queueEntryRepository.enqueue(userId);
  }

  async dequeueWaitingUserId(count: number): Promise<string[]> {
    return await this.queueEntryRepository.dequeueWaitingUserId(count);
  }

  async grantReservationPermissions(userIds: string[]): Promise<string[]> {
    return await this.queueEntryRepository.grantReservationPermissions(userIds);
  }

  async getReservationPermission(userId: string): Promise<boolean> {
    return await this.queueEntryRepository.getReservationPermission(userId);
  }

  async getQueuePosition(userId: string): Promise<QueueModel> {
    const position = await this.queueEntryRepository.getQueuePosition(userId);
    if (position === null) {
      // check if the user is in the queue
      const status =
        await this.queueEntryRepository.getReservationPermission(userId);
      console.log(status);
      if (!status) {
        throw ErrorFactory.createException(ErrorCode.QUEUE_NOT_FOUND);
      }
      return QueueModel.create(userId, QueueEntryStatus.ELIGIBLE, 0);
    }

    return QueueModel.create(userId, QueueEntryStatus.WAITING, position);
  }
}
