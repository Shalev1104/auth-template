import { NotFoundException } from '@nestjs/common';

export class VerificationNotFoundException extends NotFoundException {
  constructor() {
    super('Verification does not exist');
  }
}
