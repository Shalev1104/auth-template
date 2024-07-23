import { BadRequestException } from '@nestjs/common';

export class ProviderNotExistException extends BadRequestException {
  constructor() {
    super('Invalid provider');
  }
}
