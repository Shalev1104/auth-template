import { UnauthorizedException } from '@nestjs/common';

export class InvalidGithubCodeException extends UnauthorizedException {
  constructor() {
    super('Invalid github code.');
  }
}
