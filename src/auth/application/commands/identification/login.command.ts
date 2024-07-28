import { AuthenticationService } from '@auth/application/services/authentication.service';
import { EncryptionService } from '@auth/application/services/encryption.service';
import { AttemptedLoginEvent } from '@auth/domain/events/attempted-login';
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

export class LoginCommand implements ICommand {
  constructor(
    public readonly loginDto: LoginDto,
    public readonly ipAddress: string,
  ) {}
}

export type LoginCommandResult = Promise<{
  user: UserWithEmailAndPasswordLogin;
  authenticationTokens: AuthenticationTokens;
}>;

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly encryptionService: EncryptionService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: LoginCommand): Promise<LoginCommandResult> {
    const { emailAddress, password } = command.loginDto;

    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(
        await this.userRepository.getUserByEmail(emailAddress),
        new IncorrectEmailOrPasswordException(),
      ) as UserWithEmailAndPasswordLogin,
    );
    const isCorrectPassword = await this.encryptionService.verifyPassword(
      password,
      user.emailAndPasswordLogin.hashedPassword,
    );
    user.apply(
      new AttemptedLoginEvent(user, isCorrectPassword, command.ipAddress),
    );
    user.commit();

    if (!isCorrectPassword) throw new IncorrectEmailOrPasswordException();

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
