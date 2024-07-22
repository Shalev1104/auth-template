import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
})
export class DatabaseModule {}
