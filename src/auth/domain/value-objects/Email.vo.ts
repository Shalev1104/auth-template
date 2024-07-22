import { ValueObject } from '@common/domain/value-object';

export class Email extends ValueObject<string> {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private readonly _address: string) {
    super(_address);
  }

  get address(): string {
    return this._address;
  }

  get domain(): string {
    return this.address.split('@')[1];
  }

  validate() {
    return this.emailRegex.test(this.address);
  }
}
