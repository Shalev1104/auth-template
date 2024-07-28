import { EmailAddress } from '@auth/domain/value-objects/EmailAddress';
import { Name } from '@auth/domain/value-objects/UserProfile';
import { VerificationCode } from '@auth/domain/value-objects/VerificationCode';
import { MailService } from '@common/infrastructure/communications/mail/mail.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthMailService {
  constructor(private readonly mailService: MailService) {}

  async sendWelcomeMail(email: EmailAddress, name: Name) {
    await this.mailService.sendEmail(
      email,
      'Welcome',
      '../../auth/infrastructure/mail/templates/welcome',
      {
        name,
      },
    );
  }

  async sendEmailVerificationMail(
    email: EmailAddress,
    name: Name,
    verificationCode: VerificationCode,
  ) {
    await this.mailService.sendEmail(
      email,
      'Confirm your Email',
      '../../auth/infrastructure/mail/templates/confirm-email',
      {
        name,
        url: '',
        code: verificationCode,
      },
    );
  }
}
