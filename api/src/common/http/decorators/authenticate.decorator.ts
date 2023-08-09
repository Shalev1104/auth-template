import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthenticationGuard } from '@auth/infrastructure/http/authentication/authenticate.guard';

export function Authenticate() {
  return applyDecorators(UseGuards(AuthenticationGuard));
}
