import { NotFoundException } from '@nestjs/common';

export class SharedSecretNotFound extends NotFoundException {
  constructor() {
    super(`Please setup Authenticator verification first.`);
  }
}
