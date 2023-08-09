import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistException extends BadRequestException {
  constructor() {
    super('User already exist');
  }
}
