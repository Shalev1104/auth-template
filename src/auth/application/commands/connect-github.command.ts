import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { GithubService } from '../services/github.service';
import { UserFactory } from '../factories/user.factory';
import { User } from '@auth/domain/User.aggregate';
import { GithubUser } from '@auth/domain/strategies/github.strategy';
import { MissingOAuthCode } from '@auth/domain/exceptions/missing-oauth-code.exception';
import { LoginProvider } from '@auth/domain/value-objects/LoginProvider';

export class ConnectWithGithubCommand implements ICommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConnectWithGithubCommand)
export class ConnectWithGithubCommandHandler implements ICommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly githubService: GithubService,
  ) {}

  private async getOrRegisterUser(githubUser: GithubUser): Promise<User> {
    const user: User | undefined = await this.userRepository.getUserById(
      githubUser.id.toString(),
    );

    if (user) return user;

    return this.eventPublisher.mergeObjectContext(
      await this.userFactory.createUser(LoginProvider.Github, {
        emailAddress: githubUser.email,
        name: githubUser.name,
        avatarImageUrl: githubUser.avatar_url,
      }),
    );
  }

  async execute(command: ConnectWithGithubCommand) {
    const { code } = command;
    if (!code) throw new MissingOAuthCode();

    const accessToken = await this.githubService.getGithubAccessToken(code);
    const githubUser = await this.githubService.getGithubUserFromAccessToken(
      accessToken,
    );

    const user = await this.getOrRegisterUser(githubUser);

    const autheticationTokens =
      await this.githubService.createAuthenticationTokens(user);

    user.commit();

    return autheticationTokens;
  }
}
