import { ConflictException } from '@nestjs/common';

export class UserAlreadyLinkedException extends ConflictException {
  constructor() {
    super('The selected User is already associated with different account');
  }
}
