import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRedisRepository } from './cache/iredis.repository';
import { RedisRepository } from './cache/redis.repository';
import { redisClientFactory } from './cache/redis.factory';

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
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: +config.get('POSTGRES_PORT'),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [
          'dist/src/common/infrastructure/database/typeorm/schemas/**/*.schema.js',
        ],
        seeds: [
          'dist/src/common/infrastructure/database/typeorm/seeds/**/*.seeder.js',
        ],
      }),
    }),
  ],
  providers: [...repositories, redisClientFactory],
  exports: [...repositories, redisClientFactory, TypeOrmModule],
})
export class DatabaseModule {}
