import { BadRequestException } from '@nestjs/common';
import { ValueObject } from '@common/domain/value-object';

export class PlainPassword extends ValueObject<string> {
  constructor(private readonly _password: string) {
    super(_password);
  }

  get password(): string {
    return this._password;
  }

  validate() {
    try {
      return (
        this.atLeastEightCharacters() &&
        this.atLeastOneDigitChar() &&
        this.atLeastOneLowerLetter() &&
        this.atLeastOneUpperLetter()
      );
    } catch (exceptionMessage) {
      throw new BadRequestException(exceptionMessage);
    }
  }

  private atLeastEightCharacters() {
    const atLeastEightCharacters = this.password.length >= 8;
    if (!atLeastEightCharacters)
      throw 'Password should contain at least 8 characters';

    return true;
  }

  private atLeastOneLowerLetter() {
    const atLeastOneLowerLetter = /(?=.*[a-z])/.test(this.password);
    if (!atLeastOneLowerLetter)
      throw 'Password should contain at least one lower letter';
    return true;
  }

  private atLeastOneUpperLetter() {
    const atLeastOneUpperLetter = /(?=.*[A-Z])/.test(this.password);
    if (!atLeastOneUpperLetter)
      throw 'Password should contain at least one upper letter';
    return true;
  }

  private atLeastOneDigitChar() {
    const atLeastOneDigitChar = /\d/.test(this.password);
    if (!atLeastOneDigitChar)
      throw 'Password should contain at least one digit';
    return true;
  }
}
