import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';

@Injectable()
export class QueueEntryRepository {
  constructor(private readonly redisService: RedisService) {}

  async enqueue(userId: string): Promise<number> {
    return await this.redisService.addToQueue(userId);
  }

  async dequeueWaitingUserId(count: number): Promise<string[]> {
    return await this.redisService.dequeueWatingUserId(count);
  }

  async grantReservationPermissions(userIds: string[]): Promise<string[]> {
    return await this.redisService.grantReservationPermissions(userIds);
  }

  async getReservationPermission(userId: string): Promise<boolean> {
    return await this.redisService.getReservationPermission(userId);
  }

  async getQueuePosition(userId: string): Promise<number | null> {
    return await this.redisService.getQueuePosition(userId);
  }
}
