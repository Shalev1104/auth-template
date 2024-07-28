import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nanoid from 'nanoid';
import {
  EncryptedVerificationCode,
  VerificationCode,
  verificationDigits,
} from '@auth/domain/value-objects/VerificationCode';
import { validateSchema } from '@common/domain/entity-validate';
import { EncryptionService } from '../encryption.service';

@Injectable()
export class OtpService {
  private readonly digits = verificationDigits;
  constructor(private readonly encryptionService: EncryptionService) {}

  async generateOneTimePassword(): Promise<VerificationCode> {
    try {
      return validateSchema(
        VerificationCode,
        nanoid.customAlphabet('0123456789', this.digits)(),
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async encryptOneTimePassword(otp: string) {
    try {
      return validateSchema(
        EncryptedVerificationCode,
        await this.encryptionService.encrypt(otp),
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async verifyOneTimePassword(
    verificationCode: VerificationCode,
    encryptedVerificationCode: EncryptedVerificationCode,
  ) {
    try {
      const decrypted = await this.encryptionService.decrypt(
        encryptedVerificationCode,
      );
      return decrypted === verificationCode;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
