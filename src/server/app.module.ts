import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { envSchemaValidation } from '@server/env-schema.validator';
import { DatabaseModule } from '@common/infrastructure/database/database.module';
import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { MailModule } from '@common/infrastructure/communications/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: envSchemaValidation.parse,
    }),
    CqrsModule,
    DatabaseModule,
    MailModule,
    AuthModule,
  ],
})
export class AppModule {}
