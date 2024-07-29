import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRedisRepository } from './cache/iredis.repository';
import { RedisRepository } from './cache/redis.repository';
import { redisClientFactory } from './cache/redis.factory';
import { datasourceOptions } from './typeorm/config/datasource-options';

const repositories = [
  {
    provide: IRedisRepository,
    useClass: RedisRepository,
  },
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...datasourceOptions,
        autoLoadEntities: true,
      }),
    }),
  ],
  providers: [...repositories, redisClientFactory],
  exports: [...repositories, redisClientFactory, TypeOrmModule],
})
export class DatabaseModule {}
