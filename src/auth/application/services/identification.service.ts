import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PlainPassword,
  HashedPassword,
} from '@auth/domain/value-objects/Password';
import { HashingService } from '@common/application/services/cryptography/hashing.service';

@Injectable()
export class IdentificationService {
  constructor(private readonly hashingService: HashingService) {}

  async hashPlainPassword(plainPassword: PlainPassword): Promise<string> {
    try {
      return await this.hashingService.hash(plainPassword);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async verifyPassword(
    plainPassword: PlainPassword,
    hashedPassword: HashedPassword,
  ): Promise<boolean> {
    try {
      return await this.hashingService.compare(plainPassword, hashedPassword);
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
