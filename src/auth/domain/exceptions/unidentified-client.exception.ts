import { BadRequestException } from '@nestjs/common';

export class UnidentifiedClientException extends BadRequestException {
  constructor() {
    super('An unidentified client error has occurred.');
  }
}
