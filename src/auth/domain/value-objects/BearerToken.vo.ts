import { ValueObject } from '@common/ddd/value-object';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';

export class BearerToken extends ValueObject<string> {
  private readonly bearerRegex =
    /^Bearer (?<token>[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)$/;

  constructor(private readonly _token: string) {
    super(`Bearer ${_token}`);
  }

  get bearerToken(): string {
    return this._token;
  }

  get token(): string {
    return this.bearerToken.split(' ')[1];
  }

  validate() {
    return this.bearerRegex.test(this.bearerToken);
  }

  catch() {
    throw new InvalidTokenException();
  }
}
