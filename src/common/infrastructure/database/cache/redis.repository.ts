import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
} from '@nestjs/common';
import { ChainableCommander, Redis } from 'ioredis';
import { IRedisRepository } from './iredis.repository';
import { IRedisClient } from './redis.factory';

@Injectable()
export class RedisRepository implements OnModuleDestroy, IRedisRepository {
  constructor(@Inject(IRedisClient) private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  public async get(key: string) {
    try {
      return await this.redisClient.get(key);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async set(
    key: string,
    value: string | number | Buffer,
    ttlInSeconds?: number,
  ) {
    try {
      if (ttlInSeconds)
        await this.redisClient.set(key, value, 'EX', ttlInSeconds);
      else await this.redisClient.set(key, value);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async delete(key: string) {
    try {
      await this.redisClient.del(key);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async ttl(key: string) {
    try {
      return await this.redisClient.ttl(key);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async transaction(
    callback: (multi: ChainableCommander) => void,
  ): Promise<void> {
    try {
      const multi = this.redisClient.multi();
      callback(multi);
      await multi.exec();
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
