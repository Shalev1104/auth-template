import { AuthenticationService } from '@auth/application/services/authentication.service';
import { MissingRefreshTokenException } from '@auth/domain/exceptions/tokens/missing-refresh-token.exception';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { User } from '@auth/domain/User.aggregate';
import {
  AuthenticationTokens,
  RefreshToken,
} from '@auth/domain/value-objects/Tokens';
import { Inject } from '@nestjs/common';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';

export class RefreshAccessTokenCommand implements ICommand {
  constructor(public readonly refreshToken: RefreshToken) {}
}

export type RefreshAccessTokenCommandResult = Promise<AuthenticationTokens>;

@CommandHandler(RefreshAccessTokenCommand)
export class RefreshAccessTokenCommandHandler implements ICommandHandler {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: RefreshAccessTokenCommand,
  ): RefreshAccessTokenCommandResult {
    const { refreshToken } = command;
    if (!refreshToken) throw new MissingRefreshTokenException();

    const decodedRefreshToken =
      await this.authenticationService.verifyRefreshToken(refreshToken);

    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(
        await this.userRepository.getUserById(decodedRefreshToken.sub),
      ),
    );

    const autheticationTokens =
      await this.authenticationService.createAuthenticationTokens(
        user,
        decodedRefreshToken.refresh_count + 1,
      );

    user.updateLastLogin();
    await this.userRepository.save(user);
    user.commit();

    return autheticationTokens;
  }
}
