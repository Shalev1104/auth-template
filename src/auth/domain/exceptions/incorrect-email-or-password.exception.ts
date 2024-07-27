import { ForbiddenException } from '@nestjs/common';

export class IncorrectEmailOrPasswordException extends ForbiddenException {
  constructor() {
    super('Incorrect email or password');
  }
}
