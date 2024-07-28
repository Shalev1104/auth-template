import { Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { TelephonyService } from './telephony/telephony.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, MailModule],
  providers: [MailService, TelephonyService],
  exports: [MailService, TelephonyService],
})
export class CommunicationsModule {}
