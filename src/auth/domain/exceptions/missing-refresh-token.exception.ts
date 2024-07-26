import { UnauthorizedException } from '@nestjs/common';

export class MissingRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Login session has expired. Please log in again');
  }
}
