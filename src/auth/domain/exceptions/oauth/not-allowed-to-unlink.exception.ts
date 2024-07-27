import { ForbiddenException } from '@nestjs/common';

export class NotAllowedToUnlinkException extends ForbiddenException {
  constructor() {
    super('User must have at least one login method');
  }
}
