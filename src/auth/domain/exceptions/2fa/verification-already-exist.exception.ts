import { ConflictException } from '@nestjs/common';

export class VerificationAlreadyExistException extends ConflictException {
  constructor() {
    super(`User already verified selected channel.`);
  }
}
