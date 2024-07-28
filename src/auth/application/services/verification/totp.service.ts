import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Base32 } from '@common/domain/value-objects/Encoding';
import * as speakeasy from 'speakeasy';
import {
  VerificationCode,
  verificationDigits,
} from '@auth/domain/value-objects/VerificationCode';
import { SharedSecret } from '@auth/domain/value-objects/SharedSecret';
import { validateSchema } from '@common/domain/entity-validate';
import { EmailAddress } from '@auth/domain/value-objects/EmailAddress';

@Injectable()
export class TotpService {
  private readonly digits = verificationDigits;
  private readonly totpInterval = 30;
  private readonly secretNumOfBytes = 20;
  private readonly algorithm = 'sha1';
  private readonly encoding = 'base32';
  private readonly window = 0;

  generateSharedSecret(): Base32 {
    try {
      return validateSchema(
        Base32,
        speakeasy.generateSecret({
          length: this.secretNumOfBytes,
        })[this.encoding],
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getOtpauthUrl(
    sharedSecret: NonNullable<SharedSecret>,
    emailAddress: EmailAddress,
  ) {
    try {
      return speakeasy.otpauthURL({
        issuer: emailAddress,
        label: emailAddress,
        secret: sharedSecret,
        digits: this.digits,
        algorithm: this.algorithm,
        encoding: this.encoding,
        period: this.totpInterval,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async generateTimeBasedOneTimePassword(
    secret: NonNullable<SharedSecret>,
  ): Promise<VerificationCode> {
    try {
      return speakeasy.totp({
        secret,
        step: this.totpInterval,
        algorithm: this.algorithm,
        digits: this.digits,
        encoding: this.encoding,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async verifyTimeBasedOneTimePassword(
    otp: VerificationCode,
    userSharedSecret: NonNullable<SharedSecret>,
  ): Promise<boolean> {
    try {
      return speakeasy.totp.verify({
        token: otp,
        secret: userSharedSecret,
        algorithm: this.algorithm,
        encoding: this.encoding,
        digits: this.digits,
        window: this.window,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
