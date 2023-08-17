import { UnauthorizedException } from '@nestjs/common';

export class InvalidOAuthCodeException extends UnauthorizedException {
  constructor() {
    super('Invalid OAuth code.');
  }
}
