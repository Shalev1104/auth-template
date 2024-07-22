import { IncorrectPasswordException } from '@auth/domain/exceptions/incorrect-password.exception';
import { UserNotFoundException } from '@auth/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { AccessToken, RefreshToken } from '@common/infrastructure/http/tokens';
import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticationService } from '../services/auth.service';
import { EncryptionService } from '../services/encryption.service';

export class LoginCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(command: LoginCommand): Promise<[AccessToken, RefreshToken]> {
    const { email, password } = command;

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new UserNotFoundException();

    const { userId, hashedPassword } = user;
    if (
      !(await this.encryptionService.verifyPassword(
        password,
        hashedPassword.password,
      ))
    )
      throw new IncorrectPasswordException();

    const autheticationTokens =
      await this.authenticationService.createAuthenticationTokens(userId);

    user.updateLastLogin();
    user.commit();

    return autheticationTokens;
  }
}
