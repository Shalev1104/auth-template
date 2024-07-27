import { ForbiddenException } from '@nestjs/common';

export class TokenVerifyFailedException extends ForbiddenException {
  constructor() {
    super('Unable to verify access token; it may be expired or invalid.');
  }
}
