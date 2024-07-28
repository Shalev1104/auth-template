import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio, twiml } from 'twilio';

@Injectable()
export class TelephonyService {
  private readonly client: Twilio;
  private readonly fromCaller: string;

  constructor(protected configService: ConfigService) {
    this.client = new Twilio(
      configService.get('TWILIO_ACCOUNT_SID'),
      configService.get('TWILIO_AUTH_TOKEN'),
    );
    this.fromCaller = this.configService.get('TWILIO_PHONE_NUMBER').toString();
  }

  async sendSms(to: string, content: string) {
    try {
      await this.client.messages.create({
        from: this.fromCaller,
        to,
        body: content,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async makePhoneCall(to: string, say: string) {
    try {
      const voiceResponse = new twiml.VoiceResponse();
      voiceResponse.say(say);

      await this.client.calls.create({
        from: this.fromCaller,
        to,
        twiml: voiceResponse.toString(),
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
