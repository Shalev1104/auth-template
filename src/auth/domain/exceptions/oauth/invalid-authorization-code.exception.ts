import { ForbiddenException } from '@nestjs/common';

export class InvalidAuthorizationCodeException extends ForbiddenException {
  constructor() {
    super(
      'Unable to exchange authorization code. The provided code is either incorrect or has expired.',
    );
  }
}
