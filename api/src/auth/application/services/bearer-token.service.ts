import { BearerToken } from '@auth/domain/value-objects/BearerToken.vo';
import { ValueObject } from '@common/ddd/value-object';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BearerTokenService {
  fromTokenToBearer(token: string): string {
    return new BearerToken(token).bearerToken;
  }

  fromBearerToToken(bearerToken: string): string {
    const validatedBearerToken = ValueObject.createValueObjectOrFail(
      BearerToken,
      bearerToken,
    );

    return validatedBearerToken.token;
  }
}
