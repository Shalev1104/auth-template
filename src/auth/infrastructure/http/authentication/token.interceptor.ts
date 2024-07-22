import { AuthenticationService } from '@auth/application/services/auth.service';
import { AccessToken, RefreshToken } from '@common/infrastructure/http/tokens';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { Response } from 'express';

export type AuthenticationTokens = [AccessToken, RefreshToken];
interface ResponseBody {
  tokens: AuthenticationTokens;
  response: string;
}

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthenticationService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ResponseBody>,
  ): Observable<string> {
    return next.handle().pipe(
      map((resBody) => {
        const response = context.switchToHttp().getResponse<Response>();
        const [accessToken, refreshToken] = resBody.tokens;

        this.authService.setAuthenticationTokensToResponseCookie(
          response,
          accessToken,
          refreshToken,
        );
        return resBody.response;
      }),
    );
  }
}
