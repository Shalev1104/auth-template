import { BearerToken } from '@auth/domain/value-objects/Tokens';
import { validateSchema } from '@common/domain/entity-validate';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BearerTokenService {
  fromTokenToBearer(token: string): BearerToken {
    return `Bearer ${token}`;
  }

  fromBearerToToken(bearerToken: string): string {
    return validateSchema(BearerToken, bearerToken).split(' ')[1];
  }
}
