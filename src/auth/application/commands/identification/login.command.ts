import { AuthenticationService } from '@auth/application/services/authentication.service';
import { EncryptionService } from '@auth/application/services/encryption.service';
import { AttemptedLoginEvent } from '@auth/domain/events/attempted-login';
import { IncorrectEmailOrPasswordException } from '@auth/domain/exceptions/incorrect-email-or-password.exception';
import {
  User,
  UserWithEmailAndPasswordLogin,
} from '@auth/domain/User.aggregate';
import { AuthenticationTokens } from '@auth/domain/value-objects/Tokens';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { LoginDto } from '@auth/infrastructure/http/dtos/login.dto';
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
    private readonly userRepository: UserRepository,
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
