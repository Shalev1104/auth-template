import { ForbiddenException } from '@nestjs/common';

export class ExceededVerificationAttemptsException extends ForbiddenException {
  constructor() {
    super('Verification attempts limit reached. Login failed.');
  }
}
