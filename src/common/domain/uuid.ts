import { BadRequestException } from '@nestjs/common';
import { v4 as generateUUID } from 'uuid';

export class Uuid extends String {
  constructor(uuidParam?: string) {
    const uuid = uuidParam || generateUUID();
    super(uuid);
    this.ensureIsValidUuid(uuid);
  }

  private ensureIsValidUuid(id: string): void {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    if (!regexExp.test(id)) {
      throw new BadRequestException(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
  }
}
