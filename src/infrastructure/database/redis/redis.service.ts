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
  private readonly queueKey = 'concert:wating';
  private readonly activeTokenKey = 'concert:active';
  private readonly maxQueueSize = 50000;
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

  async getReservationPermission(userId: string): Promise<boolean> {
    const score = await this.redisClient.zscore(this.activeTokenKey, userId);
    if (score === null) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    if (parseInt(score) <= currentTime) {
      await this.redisClient.zrem(this.activeTokenKey, userId);
      return false;
    }

    return true;
  }
  async addToQueue(userId: string): Promise<number> {
    const script = `
    local queueKey = KEYS[1]
    local maxSize = tonumber(ARGV[1])
    local userId = ARGV[2]
    local score = tonumber(ARGV[3])
    
    local queueSize = redis.call('ZCARD', queueKey)
    if queueSize >= maxSize then
      return -1  -- Queue is full
    end
    
    return redis.call('ZADD', queueKey, score, userId)
  `;

    const score = Date.now(); // 현재 시간을 점수로 사용
    const result = (await this.redisClient.eval(
      script,
      1,
      this.queueKey,
      this.maxQueueSize,
      userId,
      score,
    )) as number;

    if (result === -1) {
      throw ErrorFactory.createException(ErrorCode.QUEUE_NOT_FOUND);
    }

    return result;
  }

  async dequeueWaitingUserId(count: number): Promise<string[]> {
    const script = `
    local queueKey = KEYS[1]
    local count = tonumber(ARGV[1])
    
    local users = redis.call('ZRANGE', queueKey, 0, count - 1)
    if #users > 0 then
      redis.call('ZREMRANGEBYRANK', queueKey, 0, count - 1)
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
      local activeTokensKey = KEYS[1]
      local tokenDuration = tonumber(ARGV[1])
      local userIds = cjson.decode(ARGV[2])
      local currentTime = redis.call('TIME')[1]
      local grantedUsers = {}

      for i, userId in ipairs(userIds) do
        local added = redis.call('ZADD', activeTokensKey, 'NX', currentTime + tokenDuration, userId)
        if added == 1 then
          table.insert(grantedUsers, userId)
        end
      end

      return grantedUsers
    `;

    return (await this.redisClient.eval(
      script,
      1,
      this.activeTokenKey,
      this.tokenDuration,
      JSON.stringify(userIds),
    )) as string[];
  }
  async getQueuePosition(userId: string): Promise<number | null> {
    const rank = await this.redisClient.zrank(this.queueKey, userId);
    return rank !== null ? rank + 1 : null;
  }

  async cleanupExpiredTokens(): Promise<void> {
    const currentTime = Math.floor(Date.now() / 1000);
    await this.redisClient.zremrangebyscore(
      this.activeTokenKey,
      '-inf',
      currentTime,
    );
  }
}
