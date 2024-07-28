import { AuthenticationService } from '@auth/application/services/authentication.service';
import { IdentificationService } from '@auth/application/services/identification.service';
import { LoginVerificationStore } from '@auth/application/services/verification/stores/login-verification-store.service';
import { VerificationId } from '@auth/domain/entities/Verification.entity';
import { AttemptedLoginEvent } from '@auth/domain/events/attempted-login';
import { InitiatedVerificationEvent } from '@auth/domain/events/initiated-verification.event';
import { VerificationCodeNotFoundException } from '@auth/domain/exceptions/2fa/verification-code-not-found.exception';
import { IncorrectEmailOrPasswordException } from '@auth/domain/exceptions/email-and-password/incorrect-email-or-password.exception';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import {
  User,
  UserWithEmailAndPasswordLogin,
} from '@auth/domain/User.aggregate';
import { AuthenticationTokens } from '@auth/domain/value-objects/Tokens';
import { LoginDto } from '@auth/infrastructure/http/controllers/auth/auth.dto';
import { Inject } from '@nestjs/common';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { v4 } from 'uuid';

export class LoginCommand implements ICommand {
  constructor(
    public readonly loginDto: LoginDto,
    public readonly ipAddress: string,
  ) {}
}

type CompleteLoginResult = Promise<{
  type: 'CompleteLogin';
  user: UserWithEmailAndPasswordLogin;
  authenticationTokens: AuthenticationTokens;
}>;
type Login2FAResult = Promise<{
  type: 'Login2FA';
  user: UserWithEmailAndPasswordLogin;
  channelId: number;
  twoFactorAuthenticationId: string;
}>;
export type LoginCommandResult = Promise<CompleteLoginResult | Login2FAResult>;

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly identificationService: IdentificationService,
    private readonly eventPublisher: EventPublisher,
    private readonly loginVerificationStore: LoginVerificationStore,
  ) {}

  async execute(command: LoginCommand): LoginCommandResult {
    const { emailAddress, password } = command.loginDto;

    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(
        await this.userRepository.getUserByEmail(emailAddress),
        new IncorrectEmailOrPasswordException(),
      ) as UserWithEmailAndPasswordLogin,
    );

    const isCorrectPassword = await this.identificationService.verifyPassword(
      password,
      user.emailAndPasswordLogin.hashedPassword,
    );
    user.apply(
      new AttemptedLoginEvent(user, isCorrectPassword, command.ipAddress),
    );
    user.commit();

    if (!isCorrectPassword) throw new IncorrectEmailOrPasswordException();

    if (user.emailAndPasswordLogin.isEnabled2FA())
      return await this.login2FA(
        user,
        user.emailAndPasswordLogin.twoFactorAuthentication.verificationId,
      );
    return await this.completeLogin(user);
  }

  async login2FA(
    user: UserWithEmailAndPasswordLogin,
    primaryVerificationId: VerificationId,
  ): Login2FAResult {
    const verification = user.emailAndPasswordLogin.verifications.get(
      primaryVerificationId,
    );
    if (!verification) throw new VerificationCodeNotFoundException();

    const twoFactorAuthenticationId = v4();

    user.apply(
      new InitiatedVerificationEvent(
        user,
        twoFactorAuthenticationId,
        verification.channelId,
        this.loginVerificationStore,
      ),
    );

    user.commit();

    return {
      type: 'Login2FA',
      user,
      channelId: verification.channelId,
      twoFactorAuthenticationId,
    };
  }

  async completeLogin(
    user: UserWithEmailAndPasswordLogin,
  ): CompleteLoginResult {
    const authenticationTokens =
      await this.authenticationService.createAuthenticationTokens(user);

    user.updateLastLogin();
    await this.userRepository.save(user);
    user.commit();

    return {
      type: 'CompleteLogin',
      user,
      authenticationTokens,
    };
  }
}
