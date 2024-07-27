import {
  Controller,
  Get,
  UseInterceptors,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Redirect,
  UseFilters,
  Delete,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Authenticate,
  Claims,
  MaybeClaims,
} from '@common/infrastructure/http/decorators/authenticate.decorator';
import { ConnectWithOAuthCommand } from '@auth/application/commands/authorization/connect-oauth.command';
import { Request, Response } from 'express';
import { OAuthProviderParam } from './provider.decorator';
import { CustomExpressResponse } from '@common/infrastructure/http/express/http-context';
import { SetCookieTokensInterceptor } from '../../interceptors/set-cookie-token.interceptor';
import { OAuthExceptionFilter } from './oauth-exception.filter';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { ProviderNotExistException } from '@auth/domain/exceptions/OAuth/provider-not-exist.exception';
import { GoogleService } from '../../../oauth/google/google.service';
import { GithubService } from '../../../oauth/github/github.service';
import { UnlinkOAuthCommand } from '@auth/application/commands/authorization/unlink-oauth.command';

@Controller('auth/oauth')
export class OAuthController {
  private readonly services = new Map<OAuthProvider, any>();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly githubService: GithubService,
    private readonly googleService: GoogleService,
  ) {
    this.services.set(OAuthProvider.Google, this.googleService);
    this.services.set(OAuthProvider.Github, this.githubService);
  }

  @Get('login/:provider')
  @UseFilters(OAuthExceptionFilter)
  async loginWithOAuth(
    @OAuthProviderParam() provider: OAuthProvider,
    @Res() response: Response,
    @Query('redirectUrl') clientRedirectUrl?: string,
  ) {
    const service = this.services.get(provider);
    if (!service) throw new ProviderNotExistException();
    service.setOAuthStateToResponseCookie(response, clientRedirectUrl);
    return response.redirect(service.getLoginUrl());
  }

  @Get('connect/:provider/callback')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(SetCookieTokensInterceptor)
  @UseFilters(OAuthExceptionFilter)
  @Redirect()
  async connectOAuthCallback(
    @OAuthProviderParam() provider: OAuthProvider,
    @Claims() claims: MaybeClaims,
    @Req() request: Request,
    @Res({ passthrough: true }) response: CustomExpressResponse,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const service = this.services.get(provider);
    if (!service) throw new ProviderNotExistException();

    response.authenticationTokens = await this.commandBus.execute(
      new ConnectWithOAuthCommand(
        service,
        code,
        state,
        request.signedCookies,
        claims?.sub,
      ),
    );

    response.clearCookie(state);
    return { url: request.signedCookies[state] };
  }

  @Delete('unlink/:provider')
  @Authenticate()
  async unlinkOAuth(
    @OAuthProviderParam() provider: OAuthProvider,
    @Claims() { sub }: Claims,
  ) {
    const service = this.services.get(provider);
    if (!service) throw new ProviderNotExistException();

    await this.commandBus.execute(new UnlinkOAuthCommand(sub, service));
    return `Successfully unlinked ${service.provider} from your account`;
  }
}
