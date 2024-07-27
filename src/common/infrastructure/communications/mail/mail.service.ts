import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    toAddress: string,
    subject: string,
    templatePath: string,
    data?: object,
  ) {
    try {
      await this.mailerService.sendMail({
        to: toAddress,
        subject: subject,
        template: templatePath,
        context: data,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
