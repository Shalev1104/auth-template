import { UserWithEmailAndPasswordLogin } from '@auth/domain/User.aggregate';
import {
  EncryptedVerificationCode,
  OtpVerification,
  TotpVerification,
  VerificationCode,
} from '@auth/domain/value-objects/VerificationCode';
import { TelephonyService } from '@common/infrastructure/communications/telephony/telephony.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthMailService } from '@auth/infrastructure/mail/auth-mail.service';
import { OTPChannel } from '@common/infrastructure/database/typeorm/enums/OtpChannel.enum';
import { OtpService } from './otp.service';
import { SharedSecretNotFound } from '@auth/domain/exceptions/2fa/shared-secret-not-found.exception';
import { TotpService } from './totp.service';

@Injectable()
export class OtpVerificator {
  constructor(protected readonly otpService: OtpService) {}

  channelId: OtpVerification;
  sendVerificationCode: (
    user: UserWithEmailAndPasswordLogin,
    verificationCode: VerificationCode,
  ) => Promise<void>;

  async confirmVerificationCode(
    verificationCode: VerificationCode,
    storedVerificationCode: EncryptedVerificationCode | null,
  ) {
    if (!storedVerificationCode) throw new InternalServerErrorException();

    return await this.otpService.verifyOneTimePassword(
      verificationCode,
      storedVerificationCode,
    );
  }
}

@Injectable()
export class AuthenticatorVerificator {
  protected channelId = TotpVerification.value;

  constructor(protected readonly totpService: TotpService) {}

  async confirmVerificationCode(
    verificationCode: VerificationCode,
    user: UserWithEmailAndPasswordLogin,
  ) {
    if (!user.emailAndPasswordLogin.sharedSecret)
      throw new SharedSecretNotFound();

    return await this.totpService.verifyTimeBasedOneTimePassword(
      verificationCode,
      user.emailAndPasswordLogin.sharedSecret,
    );
  }
}

@Injectable()
export class EmailVerificator extends OtpVerificator {
  channelId = OTPChannel.Email;
  constructor(
    protected readonly otpService: OtpService,
    private readonly mailService: AuthMailService,
  ) {
    super(otpService);
  }

  sendVerificationCode = async (
    user: UserWithEmailAndPasswordLogin,
    verificationCode: VerificationCode,
  ) => {
    await this.mailService.sendEmailVerificationMail(
      user.emailAndPasswordLogin.emailAddress,
      user.name,
      verificationCode,
    );
  };
}

@Injectable()
export class PhoneCallVerificator extends OtpVerificator {
  channelId = OTPChannel.Email;
  constructor(
    protected readonly otpService: OtpService,
    private readonly telephonyService: TelephonyService,
  ) {
    super(otpService);
  }

  sendVerificationCode = async (
    user: UserWithEmailAndPasswordLogin,
    verificationCode: VerificationCode,
  ) => {
    if (!user.phone) throw 'Missing user phone number';

    await this.telephonyService.makePhoneCall(
      user.phone,
      `Hi ${user.name}, Your verification code is ${verificationCode}`,
    );
  };
}

@Injectable()
export class SmsVerificator extends OtpVerificator {
  constructor(
    protected readonly otpService: OtpService,
    private readonly telephonyService: TelephonyService,
  ) {
    super(otpService);
  }

  sendVerificationCode = async (
    user: UserWithEmailAndPasswordLogin,
    verificationCode: VerificationCode,
  ) => {
    if (!user.phone) throw 'Missing user phone number';

    await this.telephonyService.sendSms(
      user.phone,
      `Hi ${user.name}, Your verification code is ${verificationCode}`,
    );
  };
}
