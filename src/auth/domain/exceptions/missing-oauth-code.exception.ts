import { BadRequestException } from '@nestjs/common';

export class MissingOAuthCode extends BadRequestException {
  constructor() {
    super('Missing OAuth query code');
  }
}
