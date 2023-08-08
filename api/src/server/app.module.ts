import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { configSchemaValidation } from '@common/validations/env-schema.validator';
import { DatabaseModule } from '@common/database/database.module';
import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configSchemaValidation,
    }),
    CqrsModule,
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
