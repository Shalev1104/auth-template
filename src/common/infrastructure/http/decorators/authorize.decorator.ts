import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@auth/infrastructure/http/guards/auth.guard';
import { LoginProvider } from '@auth/domain/value-objects/LoginProvider';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';

// Authorization guards to verify auth state
export const AUTHORIZATIONS_KEY = 'AUTHORIZATIONS';
const setPermittedAuthorizations = (authorizations: LoginProvider[]) =>
  SetMetadata(AUTHORIZATIONS_KEY, authorizations);

export function Authorize(...authorizations: LoginProvider[]) {
  return applyDecorators(
    setPermittedAuthorizations(authorizations),
    UseGuards(AuthGuard),
  );
}

export function AuthorizeEmailAndPassword() {
  return Authorize(LoginProvider.EmailAndPassword);
}
export function AuthorizeOAuth() {
  return Authorize(...Object.values(OAuthProvider));
}
