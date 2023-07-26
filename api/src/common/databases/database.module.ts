import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConnectionNames } from './connection-names';
import { getPgConfig } from './postgres/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './mongo/db-connection';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: DbConnectionNames.POSTGRES,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getPgConfig,
    }),
    MongooseModule.forRootAsync({
      connectionName: DbConnectionNames.MONGO,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
  ],
})
export class DatabaseModule {}
