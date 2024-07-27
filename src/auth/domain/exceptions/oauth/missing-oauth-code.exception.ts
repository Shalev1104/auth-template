import { BadRequestException } from '@nestjs/common';

export class MissingOAuthCodeException extends BadRequestException {
  constructor() {
    super('Missing OAuth query code');
  }
}
