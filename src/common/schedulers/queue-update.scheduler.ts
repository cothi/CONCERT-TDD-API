import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { ErrorFactory } from '../errors/error-factory.error';
import { ErrorCode } from '../enums/error-code.enum';

@Injectable()
export class QueueUpdateScheduler {
  constructor(private queueService: QueueService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleWatingQueue() {
    try {
      const userIds = await this.queueService.dequeueWaitingUserId(100);
      await this.queueService.grantReservationPermissions(userIds);
      await this.queueService.cleanExpiredToken();
    } catch (error) {
      throw ErrorFactory.createException(ErrorCode.BAD_REQUEST);
    }
  }
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCleanExpiredToken() {
    try {
      await this.queueService.cleanExpiredToken();
    } catch (error) {
      throw ErrorFactory.createException(ErrorCode.BAD_REQUEST);
    }
  }
}
