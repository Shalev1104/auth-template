import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { CustomExpressRequest } from '../express/http-context';
import { AuthenticationService } from '@auth/application/services/authentication.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private authenticationService: AuthenticationService) {}

  async use(
    request: CustomExpressRequest,
    response: Response,
    next: NextFunction,
  ) {
    const authenticatedUser =
      await this.authenticationService.getAuthenticatedUser(request);
    request.user = authenticatedUser;
    next();
  }
}
