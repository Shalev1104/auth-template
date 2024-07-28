import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { VerificationNotFoundException } from '@auth/domain/exceptions/2FA/verification-not-found.exception';
import { CustomExpressRequest } from '@common/infrastructure/http/express/http-context';

@Injectable()
export class TwoFactorAuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomExpressRequest>();
    const authenticatedUser = request.user;
    if (!authenticatedUser) return false;

    const is2FAEnabled = authenticatedUser['2fa'];
    if (is2FAEnabled) return true;

    throw new VerificationNotFoundException();
  }
}
