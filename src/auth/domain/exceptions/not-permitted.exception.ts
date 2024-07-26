import { ForbiddenException } from '@nestjs/common';

export class UserNotPermittedException extends ForbiddenException {
  constructor() {
    super('Insufficient authentication permissions');
  }
}
