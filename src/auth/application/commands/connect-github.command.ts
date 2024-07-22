import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { GithubService } from '../services/github.service';
import { UserFactory } from '../factories/user.factory';
import { AuthStrategy } from '@common/infrastructure/http/user';
import { User } from '@auth/domain/User.model';
import { GithubUser } from '@auth/domain/strategies/github.strategy';
import { MissingOAuthCode } from '@auth/domain/exceptions/missing-oauth-code.exception';

export class ConnectWithGithubCommand implements ICommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConnectWithGithubCommand)
export class ConnectWithGithubCommandHandler implements ICommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory<typeof AuthStrategy.Github>,
    private readonly eventPublisher: EventPublisher,
    private readonly githubService: GithubService,
  ) {}

  private async getOrRegisterUser(
    githubUser: GithubUser,
  ): Promise<User<typeof AuthStrategy.Github>> {
    const user: User<typeof AuthStrategy.Github> | undefined =
      await this.userRepository.getUserById(githubUser.id.toString());

    if (user) return user;

    return this.eventPublisher.mergeObjectContext(
      await this.userFactory.create({
        emailAddress: githubUser.email,
        name: githubUser.name,
        strategy: AuthStrategy.Github,
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
      await this.githubService.createAuthenticationTokens(user.userId);

    user.commit();

    return autheticationTokens;
  }
}
