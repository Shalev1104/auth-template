import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import {
  User,
  UserWithEmailAndPasswordLogin,
} from '@auth/domain/User.aggregate';
import {
  OtpVerification,
  VerificationCode,
} from '@auth/domain/value-objects/VerificationCode';
import { IncorrectOTPException } from '@auth/domain/exceptions/2fa/incorrect-otp.exception';
import { AuthenticationService } from '@auth/application/services/authentication.service';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { VerificationAlreadyExistException } from '@auth/domain/exceptions/2fa/verification-already-exist.exception';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { Inject } from '@nestjs/common';
import {
  AuthenticatorVerificator,
  OtpVerificator,
} from '@auth/application/services/verification/verificator.service';
import { AuthenticationTokens } from '@auth/domain/value-objects/Tokens';
import { ExceededVerificationAttemptsException } from '@auth/domain/exceptions/2fa/exceeded-verification-attempts.exception';
import { UnidentifiedClientException } from '@auth/domain/exceptions/unidentified-client.exception';
import { LoginVerificationStore } from '@auth/application/services/verification/stores/login-verification-store.service';
import { NotAuthenticatedException } from '@auth/domain/exceptions/not-authenticated.exception';
import { AttemptedConfirm2FAEvent } from '@auth/domain/events/attempted-confirm-2fa';

export class ConfirmTwoFactorAuthenticationCommand implements ICommand {
  constructor(
    public readonly verificationCode: VerificationCode,
    public readonly cookies: Record<string, unknown>,
    public readonly ipAddress: string,
  ) {}
}

export type ConfirmTwoFactorAuthenticationCommandResult = Promise<{
  user: UserWithEmailAndPasswordLogin;
  authenticationTokens: AuthenticationTokens;
}>;

@CommandHandler(ConfirmTwoFactorAuthenticationCommand)
export class ConfirmTwoFactorAuthenticationCommandHandler
  implements ICommandHandler<ConfirmTwoFactorAuthenticationCommand>
{
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly otpVerificator: OtpVerificator,
    private readonly authenticatorVerificator: AuthenticatorVerificator,
    private readonly authenticationService: AuthenticationService,
    private readonly eventPublisher: EventPublisher,
    private readonly loginVerificationStore: LoginVerificationStore,
  ) {}

  async execute({
    verificationCode,
    cookies,
    ipAddress,
  }: ConfirmTwoFactorAuthenticationCommand): ConfirmTwoFactorAuthenticationCommandResult {
    const loginCookie = this.loginVerificationStore.getCookie(cookies);
    if (!loginCookie) throw new NotAuthenticatedException();
    const loginCache = await this.loginVerificationStore.getCache(
      loginCookie.userId,
    );

    if (loginCookie.id !== loginCache.id)
      throw new UnidentifiedClientException();

    if (loginCache.channelId !== loginCookie.channelId)
      throw new UnidentifiedClientException();

    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(await this.userRepository.getUserById(loginCookie.userId)),
    );

    if (!user.isEmailAndPasswordUser()) throw new UserNotPermittedException();
    if (
      !user.emailAndPasswordLogin.isEnabled2FA(
        user.emailAndPasswordLogin.twoFactorAuthentication?.verificationId,
      )
    ) {
      await this.loginVerificationStore.deleteCache(user.userId);
      throw new VerificationAlreadyExistException();
    }

    const otpVerificationParser = OtpVerification.safeParse(
      loginCache.channelId,
    );
    const isVerified = otpVerificationParser.success
      ? await this.otpVerificator.confirmVerificationCode(
          verificationCode,
          loginCache.otp,
        )
      : await this.authenticatorVerificator.confirmVerificationCode(
          verificationCode,
          user,
        );

    user.apply(new AttemptedConfirm2FAEvent(user, isVerified, ipAddress));
    user.commit();

    if (!isVerified) {
      const { attempts } = await this.loginVerificationStore.incrementAttempts(
        user.userId,
      );

      if (attempts === this.loginVerificationStore.maxAttempts) {
        await this.loginVerificationStore.deleteCache(user.userId);
        throw new ExceededVerificationAttemptsException();
      }
      throw new IncorrectOTPException();
    }

    await this.loginVerificationStore.deleteCache(user.userId);

    const authenticationTokens =
      await this.authenticationService.createAuthenticationTokens(user);

    user.updateLastLogin();
    await this.userRepository.save(user);
    user.commit();

    return {
      user,
      authenticationTokens,
    };
  }
}
