import { LoginCommand } from '@auth/application/commands/login.command';
import { RefreshTokenCommand } from '@auth/application/commands/refresh-access-token.command';
import { RegisterCommand } from '@auth/application/commands/register.command';
import { AuthenticationService } from '@auth/application/services/auth.service';
import { Cookies } from '@common/infrastructure/http/cookies';
import { Cookie } from '@common/infrastructure/http/decorators/cookie.decorator';
import { Authenticate } from '@common/infrastructure/http/decorators/authenticate.decorator';
import { Routers, RouterRoutes } from '@common/infrastructure/http/routers';
import { RefreshToken } from '@common/infrastructure/http/tokens';
import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  Res,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  TokenInterceptor,
  AuthenticationTokens,
} from './authentication/token.interceptor';
import { LoginDto } from './dtos/login.dto';
import { ConnectWithGithubCommand } from '@auth/application/commands/connect-github.command';
import { ConnectWithGoogleCommand } from '@auth/application/commands/connect-google.command';
import { RegisterDto } from './dtos/register.dto';

@Controller(Routers.Auth)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authService: AuthenticationService,
  ) {}

  @Get()
  ping() {
    return 'Auth 🔐';
  }

  @Post(RouterRoutes.Auth.Register)
  @UseInterceptors(TokenInterceptor)
  async register(
    @Body()
    registerDto: RegisterDto,
  ) {
    const command = new RegisterCommand(registerDto);
    return await this.commandBus
      .execute<RegisterCommand, AuthenticationTokens>(command)
      .then((tokens) => ({
        tokens,
        response: 'Created new user, welcome!',
      }));
  }

  @Post(RouterRoutes.Auth.Login)
  @UseInterceptors(TokenInterceptor)
  async login(@Body() { emailAddress, password }: LoginDto) {
    const command = new LoginCommand(emailAddress, password);
    return await this.commandBus
      .execute<LoginCommand, AuthenticationTokens>(command)
      .then((tokens) => ({
        tokens,
        response: 'Successfully Logged In',
      }));
  }

  @Post(RouterRoutes.Auth.Logout)
  @Authenticate()
  async logout(@Res() response: Response) {
    this.authService.clearAuthenticationTokens(response);
    return response.send('User Disconnected');
  }

  @Post(RouterRoutes.Auth.RefreshToken)
  @UseInterceptors(TokenInterceptor)
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Cookie(Cookies.RefreshToken) refreshToken: RefreshToken,
  ) {
    const command = new RefreshTokenCommand(refreshToken);
    return await this.commandBus
      .execute<RefreshTokenCommand, AuthenticationTokens>(command)
      .then((tokens) => ({
        tokens,
        response: 'Refreshed Access token',
      }))
      .catch((e) => {
        this.authService.clearAuthenticationTokens(response);
        throw e;
      });
  }

  @Get(RouterRoutes.Auth.Github)
  @UseInterceptors(TokenInterceptor)
  async githubCallback(@Query('code') code: string) {
    const command = new ConnectWithGithubCommand(code);
    return await this.commandBus
      .execute<ConnectWithGithubCommand, AuthenticationTokens>(command)
      .then((tokens) => ({
        tokens,
        response: 'Connected with github',
      }));
  }

  @Get(RouterRoutes.Auth.Google)
  @UseInterceptors(TokenInterceptor)
  async googleCallback(@Query('code') code: string) {
    const command = new ConnectWithGoogleCommand(code);
    return await this.commandBus
      .execute<ConnectWithGoogleCommand, AuthenticationTokens>(command)
      .then((tokens) => ({
        tokens,
        response: 'Connected with github',
      }));
  }
}
