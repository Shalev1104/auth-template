import { UnauthorizedException } from '@nestjs/common';

export class NotAuthenticatedException extends UnauthorizedException {
  constructor() {
    super(
      'Authentication required: Please log in or provide valid credentials.',
    );
  }
}
