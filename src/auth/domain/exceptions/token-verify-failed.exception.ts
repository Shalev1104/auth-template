import { BadRequestException } from '@nestjs/common';

export class TokenVerifyFailedException extends BadRequestException {
  constructor() {
    super('Could not verify the given token');
  }
}
