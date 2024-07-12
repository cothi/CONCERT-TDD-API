import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';

@Injectable()
export class QueueUpdateScheduler {
  constructor(private queueService: QueueService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.queueService.updateQueueEntries();
  }
}
