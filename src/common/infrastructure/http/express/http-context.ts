import { Request, Response } from 'express';
import { MaybeClaims } from '../decorators/authenticate.decorator';
import { AuthenticationTokens } from '@auth/domain/value-objects/Tokens';

export interface CustomExpressRequest extends Request {
  user: MaybeClaims;
}
export interface CustomExpressResponse extends Response {
  authenticationTokens?: AuthenticationTokens;
}
