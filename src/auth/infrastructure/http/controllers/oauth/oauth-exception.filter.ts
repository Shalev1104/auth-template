import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class OAuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const state = request.query.state as string;
    const clientRedirectUrl = request.signedCookies[state];
    if (clientRedirectUrl) response.clearCookie(state);

    const url = new URL(clientRedirectUrl || process.env.CORS_ALLOW_ORIGINS);
    url.searchParams.set('error', exception.message);
    response.redirect(url.href);
  }
}
