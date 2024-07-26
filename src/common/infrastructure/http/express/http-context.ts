import { Request } from 'express';
import { MaybeClaims } from '../decorators/authenticate.decorator';

export interface CustomExpressRequest extends Request {
  user: MaybeClaims;
}
