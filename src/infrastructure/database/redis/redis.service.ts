import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock, { ExecutionResult } from 'redlock';
import { Lock } from 'redlock';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';

export const RedisServiceToken = Symbol('RedisService');

@Injectable()
export class RedisService {
  private redisClient: Redis;
  private readonly redlock: Redlock;
  private readonly lockDuration = 2000;
  private readonly queueKey = 'concert:queue';
  private readonly tokenPrefix = 'concert:token:';
  private readonly maxQueueSize = 3000;
  private readonly tokenDuration = 600;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');

    this.redisClient = new Redis({
      host: host,
      port: port,
    });

    this.redlock = new Redlock([this.redisClient], {
      driftFactor: 0.01,
      retryCount: 50,
      retryDelay: 500,
      retryJitter: 300,
    });
  }

  async acquireLock(key: string): Promise<Lock> {
    try {
      return await this.redlock.acquire([`lock:${key}`], this.lockDuration);
    } catch (error) {
      throw error;
    }
  }

  async releaseLock(lock: Lock): Promise<ExecutionResult> {
    try {
      return await this.redlock.release(lock);
    } catch (error) {
      throw error;
    }
  }

  async addToQueue(userId: string): Promise<number> {
    const queueSize = await this.redisClient.llen(this.queueKey);
    if (queueSize >= this.maxQueueSize) {
      throw ErrorFactory.createException(ErrorCode.QUEUE_NOT_FOUND);
    }
    return this.redisClient.rpush(this.queueKey, userId);
  }

  async getReservationPermission(userId: string): Promise<boolean> {
    const script = `
      local tokenKey = KEYS[1]
      local exists = redis.call('EXISTS', tokenKey)
      return exists == 1
    `;

    const result = (await this.redisClient.eval(
      script,
      1,
      `${this.tokenPrefix}${userId}`,
    )) as number;

    return result === 1;
  }

  async dequeueWatingUserId(count: number): Promise<string[]> {
    const script = `
      local queueKey = KEYS[1]
      local count = tonumber(ARGV[1])
      
      local users = redis.call('lrange', queueKey, 0, count - 1)
      if #users >= 0 then
        redis.call('LTRIM', queueKey, #users, -1)
      end

      return users
    `;
    return (await this.redisClient.eval(
      script,
      1,
      this.queueKey,
      count,
    )) as string[];
  }

  async grantReservationPermissions(userIds: string[]): Promise<string[]> {
    const script = `
      local activeTokenKey = KEYS[1]
      local tokenPrefix = ARGV[1]
      local tokenDuration = tonumber(ARGV[2])
      local userIds = cjson.decode(ARGV[3])
      for i, userId in ipairs(userIds) do
        local tokenKey = tokenPrefix .. userId
        local tokenExists = redis.call('exists', tokenKey)
        if tokenExists == 0 then
          redis.call('SET', tokenKey, '1', 'EX', tokenDuration)
        end
      end

      return #userIds
      `;
    const grantedCnt = await this.redisClient.eval(
      script,
      1,
      this.queueKey,
      this.tokenPrefix,
      this.tokenDuration,
      JSON.stringify(userIds),
    );

    return grantedCnt as string[];
  }

  async getQueuePosition(userId: string): Promise<number | null> {
    const script = `
      local queueKey = KEYS[1]
      local userId = ARGV[1]
      local position = redis.call('LPOS', queueKey, userId)

      if position then
        return position + 1 -- Redis 0-based index to 1-based index
      else
        return nil
      end
    `;

    const result = (await this.redisClient.eval(
      script,
      1,
      this.queueKey,
      userId,
    )) as number;

    if (result === -1) {
      return null;
    }
    return result;
  }
}
