import { BadRequestException } from '@nestjs/common';

export class MissingTokenException extends BadRequestException {
  constructor() {
    super('could not find token in cookies');
  }
}
