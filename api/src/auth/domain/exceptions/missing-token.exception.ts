import { BadRequestException } from '@nestjs/common';

export class MissingTokenException extends BadRequestException {
  constructor() {
    super('Could not find token in cookies');
  }
}
