import {
  LoginCommand,
  LoginCommandResult,
} from '@auth/application/commands/identification/login.command';
import {
  RefreshAccessTokenCommand,
  RefreshAccessTokenCommandResult,
} from '@auth/application/commands/authentication/refresh-access-token.command';
import {
  RegisterCommand,
  RegisterCommandResult,
} from '@auth/application/commands/identification/register.command';
import { AuthenticationService } from '@auth/application/services/authentication.service';
import { Cookies } from '@common/infrastructure/http/cookies';
import { Cookie } from '@common/infrastructure/http/decorators/cookie.decorator';
import {
  Authenticate,
  Claims,
} from '@common/infrastructure/http/decorators/authenticate.decorator';
import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  Res,
  Ip,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SetCookieTokensInterceptor } from '../../interceptors/set-cookie-token.interceptor';
import { RegisterDto, LoginDto, UserResponseDto } from './auth.dto';
import { RefreshToken } from '@auth/domain/value-objects/Tokens';
import { CustomExpressResponse } from '@common/infrastructure/http/express/http-context';
import { UserMapper } from '../../../database/user.mapper';
import { ZodValidationPipe } from '@common/infrastructure/http/pipes/zod-validation.pipe';
import { GetAuthenticatedUserQuery } from '@auth/application/queries/get-authenticated-user.query';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly authenticationService: AuthenticationService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get()
  ping() {
    return 'Auth 🔐';
  }

  @Get('user')
  @Authenticate()
  async getAuthenticatedUser(@Claims() claims: Claims) {
    return await this.queryBus.execute<
      GetAuthenticatedUserQuery,
      UserResponseDto
    >(new GetAuthenticatedUserQuery(claims.sub));
  }

  @Post('register')
  @UseInterceptors(SetCookieTokensInterceptor)
  async register(
    @Body(new ZodValidationPipe(RegisterDto)) registerDto: RegisterDto,
    @Res({ passthrough: true }) response: CustomExpressResponse,
  ) {
    const { user, authenticationTokens } = await this.commandBus.execute<
      RegisterCommand,
      RegisterCommandResult
    >(new RegisterCommand(registerDto));
    response.authenticationTokens = authenticationTokens;
    return this.userMapper.toResponseDTO(user);
  }

  @Post('login')
  @UseInterceptors(SetCookieTokensInterceptor)
  async login(
    @Body(new ZodValidationPipe(LoginDto)) loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) response: CustomExpressResponse,
  ) {
    const loginCommand = await this.commandBus.execute<
      LoginCommand,
      LoginCommandResult
    >(new LoginCommand(loginDto, ipAddress));

    const { authenticationTokens, user } = loginCommand;
    response.authenticationTokens = authenticationTokens;
    return this.userMapper.toResponseDTO(user);
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    this.authenticationService.clearAuthenticationTokens(response);
    return response.send('User Disconnected');
  }

  @Post('refresh')
  @UseInterceptors(SetCookieTokensInterceptor)
  async refreshToken(
    @Cookie(Cookies.RefreshToken) refreshToken: RefreshToken,
    @Res({ passthrough: true }) response: CustomExpressResponse,
  ) {
    try {
      const autheticationTokens = await this.commandBus.execute<
        RefreshAccessTokenCommand,
        RefreshAccessTokenCommandResult
      >(new RefreshAccessTokenCommand(refreshToken));
      response.authenticationTokens = autheticationTokens;
      return 'Refreshed Access token';
    } catch (e) {
      this.authenticationService.clearAuthenticationTokens(response);
      throw e;
    }
  }
}
