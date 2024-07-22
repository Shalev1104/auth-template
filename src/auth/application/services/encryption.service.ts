import { HashedPassword } from '@auth/domain/value-objects/HashedPassword.vo';
import { ValueObject } from '@common/domain/value-object';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private static readonly saltChars = 10;

  async verifyPassword(plainPw: string, hashedPw: string) {
    try {
      return await bcrypt.compare(plainPw, hashedPw);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async hashPlainPassword(plainPw: string) {
    try {
      const hashedPw = await bcrypt.hash(plainPw, EncryptionService.saltChars);
      return ValueObject.createValueObjectOrFail(HashedPassword, hashedPw);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
