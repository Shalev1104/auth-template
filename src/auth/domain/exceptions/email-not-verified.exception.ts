import { ForbiddenException } from '@nestjs/common';

export class EmailNotVerifiedException extends ForbiddenException {
  constructor() {
    super('Email is not verified');
  }
}
