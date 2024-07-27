import { EmailAddress } from '@auth/domain/value-objects/EmailAddress';
import { Name } from '@auth/domain/value-objects/UserProfile';
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
}
