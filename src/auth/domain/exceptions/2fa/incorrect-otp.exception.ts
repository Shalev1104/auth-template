import { ForbiddenException } from '@nestjs/common';

export class IncorrectOTPException extends ForbiddenException {
  constructor() {
    super('Incorrect verification code');
  }
}
