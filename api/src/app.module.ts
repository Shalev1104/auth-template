import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { configSchemaValidation } from 'src/common/validations/env.schema-validator';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configSchemaValidation,
    }),
    CqrsModule,
    DatabaseModule,
  ],
})
export class AppModule {}
