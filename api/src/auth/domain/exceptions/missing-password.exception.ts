import { InternalServerErrorException } from '@nestjs/common';

export class MissingPasswordException extends InternalServerErrorException {
  constructor() {
    super('Local user has no password');
  }
}
