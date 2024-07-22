import { ValueObject } from '@common/domain/value-object';

export class HashedPassword extends ValueObject<string> {
  constructor(private readonly _hashedPassword: string) {
    super(_hashedPassword);
  }

  get password(): string {
    return this._hashedPassword;
  }

  validate(): boolean {
    return true;
  }
}
