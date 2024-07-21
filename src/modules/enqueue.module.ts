/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { EnqueueUseCase } from 'src/application/enqueue/use-cases/enqueue.use-case';
import { GetQueueStatusUseCase } from 'src/application/enqueue/use-cases/get-queue.use-case';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { QueueEntryRepository } from 'src/infrastructure/database/repositories/enqueue/queue.repository';
import { DatabaseModule } from 'src/infrastructure/prisma/prisma.module';
import { QueueUpdateScheduler } from 'src/infrastructure/schedulers/queue-update.scheduler';
import { EnqueueController } from 'src/presentation/controller/enqueue/enqueue.controller';

@Module({
  imports: [JwtModule, ScheduleModule.forRoot(), DatabaseModule],
  controllers: [EnqueueController],
  providers: [
    EnqueueUseCase,
    GetQueueStatusUseCase,
    QueueService,
    QueueEntryRepository,
    QueueUpdateScheduler,
  ],
  exports: [QueueService, QueueEntryRepository],
})
export class EnqueueModule {}
