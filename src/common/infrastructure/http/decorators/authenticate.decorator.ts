import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthenticationGuard } from '@auth/infrastructure/http/authentication/authenticate.guard';
import { UserId } from '@auth/domain/User.aggregate';
import { Name } from '@auth/domain/value-objects/UserProfile';
import { LoginAccount } from '@auth/domain/value-objects/LoginProvider';

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
  return applyDecorators(UseGuards(AuthenticationGuard));
}
