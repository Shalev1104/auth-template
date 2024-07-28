import { UnauthorizedException } from '@nestjs/common';

export class VerificationCodeNotFoundException extends UnauthorizedException {
  constructor() {
    super('Verification code has expired or not found');
  }
}
