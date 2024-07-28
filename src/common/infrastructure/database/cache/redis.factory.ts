import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const IRedisClient = Symbol('IRedisClient');

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: IRedisClient,
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: +(process.env.REDIS_PORT || 6381),
      password: process.env.REDIS_PASS,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};
