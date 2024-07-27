import { AuthenticationService } from '@auth/application/services/authentication.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CustomExpressResponse } from '@common/infrastructure/http/express/http-context';
import { AuthenticationTokens } from '@auth/domain/value-objects/Tokens';

@Injectable()
export class SetCookieTokensInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthenticationService) {}

  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      map((body) => {
        const response = context
          .switchToHttp()
          .getResponse<CustomExpressResponse>();

        const authenticationTokensValidator = AuthenticationTokens.safeParse(
          response.authenticationTokens,
        );
        if (authenticationTokensValidator.success) {
          const [accessToken, refreshToken] =
            authenticationTokensValidator.data;

          this.authService.setAuthenticationTokensToResponseCookie(
            response,
            accessToken,
            refreshToken,
          );
        }

        return body;
      }),
    );
  }
}
