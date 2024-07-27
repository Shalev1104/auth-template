import { Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, MailModule],
  providers: [MailService],
  exports: [MailService],
})
export class CommunicationsModule {}
