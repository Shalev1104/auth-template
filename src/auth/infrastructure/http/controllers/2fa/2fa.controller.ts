import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  Res,
  Req,
  Inject,
  Ip,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  SetupVerificationCommand,
  SetupVerificationCommandResult,
} from '@auth/application/commands/verification/setup-verification.command';
import {
  ConfirmVerificationDto,
  Enable2FADto,
  Set2FADto,
  SetupVerificationDto,
} from './2fa.dto';
import {
  Claims,
  MaybeClaims,
} from '@common/infrastructure/http/decorators/authenticate.decorator';
import { AuthorizeEmailAndPassword } from '@common/infrastructure/http/decorators/authorize.decorator';
import { Transform2FAInterceptor } from '@auth/infrastructure/http/controllers/2fa/transform-2fa.interceptor';
import { ZodValidationPipe } from '@common/infrastructure/http/pipes/zod-validation.pipe';
import { QRCodeInterceptor } from '@common/infrastructure/http/interceptors/qrcode.interceptor';
import { CustomExpressResponse } from '@common/infrastructure/http/express/http-context';
import {
  ResendVerificationCodeCommand,
  ResendVerificationCodeCommandResult,
} from '@auth/application/commands/verification/resend-verification-code.command';
import { Request } from 'express';
import { User } from '@auth/domain/User.aggregate';
import { TotpService } from '@auth/application/services/verification/totp.service';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { SharedSecretNotFound } from '@auth/domain/exceptions/2fa/shared-secret-not-found.exception';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { SetupVerificationStore } from '@auth/application/services/verification/stores/setup-verification-store.service';
import { GetAllOtpChannelsQuery } from '@auth/application/queries/get-all-otp-channels.query';
import { OtpChannelSchema } from '@common/infrastructure/database/typeorm/schemas/otpChannel.schema';
import { SetCookieTokensInterceptor } from '../../interceptors/set-cookie-token.interceptor';
import {
  ConfirmVerificationRegisterationCommand,
  ConfirmVerificationRegisterationCommandResult,
} from '@auth/application/commands/verification/confirm-verification-registeration.command';
import {
  ConfirmTwoFactorAuthenticationCommand,
  ConfirmTwoFactorAuthenticationCommandResult,
} from '@auth/application/commands/verification/confirm-two-factor-authentication.command';
import { UserMapper } from '@auth/infrastructure/database/user.mapper';
import { LoginVerificationStore } from '@auth/application/services/verification/stores/login-verification-store.service';
import {
  Set2FACommand,
  Set2FACommandResult,
} from '@auth/application/commands/verification/set-2fa.command';
import { GetUserVerificationsQuery } from '@auth/application/queries/get-user-verifications.query';
import { VerificationId } from '@auth/domain/entities/Verification.entity';
import {
  RemoveVerificationCommand,
  RemoveVerificationCommandResult,
} from '@auth/application/commands/verification/remove-verification.command';

@Controller('auth/2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly setupVerificationStore: SetupVerificationStore,
    private readonly loginVerificationStore: LoginVerificationStore,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly totpService: TotpService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get()
  async getOtpChannels() {
    return await this.queryBus.execute<
      GetAllOtpChannelsQuery,
      OtpChannelSchema[]
    >(new GetAllOtpChannelsQuery());
  }
  @Patch('set')
  @AuthorizeEmailAndPassword()
  async set2FA(
    @Claims() claims: Claims,
    @Body(new ZodValidationPipe(Set2FADto)) { verificationId }: Set2FADto,
  ) {
    return await this.commandBus.execute<Set2FACommand, Set2FACommandResult>(
      new Set2FACommand(claims.sub, verificationId),
    );
  }

  @Patch('enable')
  @AuthorizeEmailAndPassword()
  async enable2FA(
    @Claims() claims: Claims,
    @Body(new ZodValidationPipe(Enable2FADto))
    { verificationId }: Enable2FADto,
  ) {
    return await this.commandBus.execute<Set2FACommand, Set2FACommandResult>(
      new Set2FACommand(claims.sub, verificationId),
    );
  }

  @Patch('disable')
  @AuthorizeEmailAndPassword()
  async disable2FA(@Claims() claims: Claims) {
    return await this.commandBus.execute<Set2FACommand, Set2FACommandResult>(
      new Set2FACommand(claims.sub),
    );
  }

  @Post('setup')
  @AuthorizeEmailAndPassword()
  @UseInterceptors(Transform2FAInterceptor)
  async setupVerification(
    @Claims() claims: Claims,
    @Body(new ZodValidationPipe(SetupVerificationDto))
    { channelId, setAsDefault2fa }: SetupVerificationDto,
    @Res({ passthrough: true }) response: CustomExpressResponse,
  ) {
    const { user, verification } = await this.commandBus.execute<
      SetupVerificationCommand,
      SetupVerificationCommandResult
    >(new SetupVerificationCommand(claims.sub, channelId));

    this.setupVerificationStore.setCookie(response, {
      id: verification.verificationId,
      channelId,
      setAsDefault2fa,
    });

    return user;
  }

  @Post('resend')
  async resendVerificationCode(
    @Claims() claims: MaybeClaims,
    @Req() request: Request,
  ) {
    return await this.commandBus.execute<
      ResendVerificationCodeCommand,
      ResendVerificationCodeCommandResult
    >(new ResendVerificationCodeCommand(claims?.sub, request.signedCookies));
  }

  @Post('confirm')
  @UseInterceptors(SetCookieTokensInterceptor)
  async confirmVerification(
    @Claims() claims: MaybeClaims,
    @Body(new ZodValidationPipe(ConfirmVerificationDto))
    { code }: ConfirmVerificationDto,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) response: CustomExpressResponse,
    @Req() request: Request,
  ) {
    if (claims) {
      await this.commandBus.execute<
        ConfirmVerificationRegisterationCommand,
        ConfirmVerificationRegisterationCommandResult
      >(
        new ConfirmVerificationRegisterationCommand(
          claims.sub,
          code,
          request.signedCookies,
        ),
      );
      this.setupVerificationStore.clearCookie(response);
      return `Successfully added requested verification channel`;
    }

    const { user, authenticationTokens } = await this.commandBus.execute<
      ConfirmTwoFactorAuthenticationCommand,
      ConfirmTwoFactorAuthenticationCommandResult
    >(
      new ConfirmTwoFactorAuthenticationCommand(
        code,
        request.signedCookies,
        ipAddress,
      ),
    );
    response.authenticationTokens = authenticationTokens;
    this.loginVerificationStore.clearCookie(response);
    return this.userMapper.toResponseDTO(user);
  }

  @Get('totp/qrcode')
  @AuthorizeEmailAndPassword()
  @UseInterceptors(QRCodeInterceptor)
  async getTotpQrCode(@Claims() claims: Claims) {
    const user = User.getOrFail(
      await this.userRepository.getUserById(claims.sub),
    );

    if (!user.isEmailAndPasswordUser()) throw new UserNotPermittedException();
    if (!user.emailAndPasswordLogin.sharedSecret)
      throw new SharedSecretNotFound();

    return await this.totpService.getOtpauthUrl(
      user.emailAndPasswordLogin.sharedSecret,
      user.emailAndPasswordLogin.emailAddress,
    );
  }

  @Get('verifications')
  @AuthorizeEmailAndPassword()
  async getUserVerificationMethods(@Claims() claims: Claims) {
    return await this.queryBus.execute(
      new GetUserVerificationsQuery(claims.sub),
    );
  }

  @Delete('verifications/:verificationId')
  @AuthorizeEmailAndPassword()
  async removeVerification(
    @Claims() claims: Claims,
    @Param('verificationId') verificationId: VerificationId,
  ) {
    await this.commandBus.execute<
      RemoveVerificationCommand,
      RemoveVerificationCommandResult
    >(new RemoveVerificationCommand(claims.sub, verificationId));
    return `Successfully removed verification ${verificationId} from your account`;
  }
}
