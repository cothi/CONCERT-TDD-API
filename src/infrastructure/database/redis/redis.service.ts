import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';
import { Lock } from 'redlock';

export const RedisServiceToken = Symbol('RedisService');

@Injectable()
export class RedisService {
  private redisClient: Redis;
  private readonly redlock: Redlock;
  private readonly lockDuration = 5_000;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');

    this.redisClient = new Redis({
      host: host,
      port: port,
    });

    this.redlock = new Redlock([this.redisClient], {
      driftFactor: 0.01,
      retryCount: 20,
      retryDelay: 2000,
      retryJitter: 500,
    });
  }

  async acquireLock(key: string) {
    return await this.redlock.acquire([`lock:${key}`], this.lockDuration);
  }

  async releaseLock(lock: Lock) {
    return await this.redlock.release(lock);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }
  async del(key: string) {
    return await this.redisClient.del(key);
  }

  async getClient() {
    return this.redisClient;
  }

  async set(key: string, value: string, timeToLive: number): Promise<string> {
    return this.redisClient.set(key, value, 'EX', timeToLive);
  }
}
