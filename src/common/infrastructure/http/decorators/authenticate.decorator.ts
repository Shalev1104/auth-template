import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { AuthGuard } from '@auth/infrastructure/http/guards/auth.guard';
import { UserId } from '@auth/domain/User.aggregate';
import { Name } from '@auth/domain/value-objects/UserProfile';
import { LoginAccount } from '@auth/domain/value-objects/LoginProvider';
import { CustomExpressRequest } from '../express/http-context';

export type Claims = {
  iss: string;
  aud: string[];
  sub: UserId;
  name: Name;
  jti: string;
  accounts: LoginAccount[];
  '2fa': boolean;
};

export type MaybeClaims = Claims | null;

export function Authenticate() {
  return applyDecorators(UseGuards(AuthGuard));
}

/** Authenticated user as request param */
export const Claims = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomExpressRequest>();
    return request.user;
  },
);
