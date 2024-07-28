/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { EnqueueUseCase } from 'src/application/enqueue/use-cases/enqueue.use-case';
import { GetQueueStatusUseCase } from 'src/application/enqueue/use-cases/get-queue.use-case';
import { QueueUpdateScheduler } from 'src/common/schedulers/queue-update.scheduler';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { QueueEntryRepository } from 'src/infrastructure/enqueue/repository/queue.repository';
import { EnqueueController } from 'src/presentation/controller/enqueue/enqueue.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [JwtModule, ScheduleModule.forRoot(), DatabaseModule, AuthModule],
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
