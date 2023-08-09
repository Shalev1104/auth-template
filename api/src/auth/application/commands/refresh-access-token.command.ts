import { MissingTokenException } from '@auth/domain/exceptions/missing-token.exception';
import { UserNotFoundException } from '@auth/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { AccessToken, RefreshToken } from '@common/http/tokens';
import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthenticationService } from '../services/auth.service';

export class RefreshTokenCommand implements ICommand {
  constructor(public readonly refreshToken: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshAccessTokenCommandHandler implements ICommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<[AccessToken, RefreshToken]> {
    const { refreshToken } = command;
    if (!refreshToken) throw new MissingTokenException();

    const { userId } = await this.authenticationService.verifyRefreshToken(
      refreshToken,
    );
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new UserNotFoundException();

    const autheticationTokens =
      await this.authenticationService.createAuthenticationTokens(user.userId);

    user.updateLastLogin();
    user.commit();

    return autheticationTokens;
  }
}
