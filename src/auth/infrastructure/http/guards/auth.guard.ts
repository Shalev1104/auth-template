import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AUTHORIZATIONS_KEY } from '@common/infrastructure/http/decorators/authorize.decorator';
import { Reflector } from '@nestjs/core';
import { LoginProvider } from '@auth/domain/value-objects/LoginProvider';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { CustomExpressRequest } from '@common/infrastructure/http/express/http-context';
import { NotAuthenticatedException } from '@auth/domain/exceptions/not-authenticated.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Authentication
    const request = context.switchToHttp().getRequest<CustomExpressRequest>();
    const authenticatedUser = request.user;
    if (!authenticatedUser) throw new NotAuthenticatedException();

    // Authorization
    const requiredAuthorizations = this.reflector.getAllAndOverride<
      LoginProvider[]
    >(AUTHORIZATIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredAuthorizations?.length) return true;

    const hasRequiredAuthorizations = authenticatedUser.accounts.some((sa) =>
      requiredAuthorizations.some((ra) => ra === sa.loginProvider),
    );
    if (hasRequiredAuthorizations) return true;

    throw new UserNotPermittedException();
  }
}
