import { ForbiddenException } from '@nestjs/common';

export class MismatchStateException extends ForbiddenException {
  constructor() {
    super('OAuth state mismatch');
  }
}
