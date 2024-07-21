import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { UserFactory } from '../factories/user.factory';
import { AuthStrategy } from '@common/http/user';
import { GoogleService } from '../services/google.service';
import { GoogleUser } from '@auth/domain/strategies/google.strategy';
import { User } from '@auth/domain/User.model';
import { EmailNotVerifiedException } from '@auth/domain/exceptions/email-not-verified.exception';
import { MissingOAuthCode } from '@auth/domain/exceptions/missing-oauth-code.exception';

export class ConnectWithGoogleCommand implements ICommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConnectWithGoogleCommand)
export class ConnectWithGoogleCommandHandler implements ICommandHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory<typeof AuthStrategy.Google>,
    private readonly eventPublisher: EventPublisher,
    private readonly googleService: GoogleService,
  ) {}

  private async getOrRegisterUser(
    googleUser: GoogleUser,
  ): Promise<User<typeof AuthStrategy.Google>> {
    const user: User<typeof AuthStrategy.Google> | undefined =
      await this.userRepository.getUserById(googleUser.id.toString());

    if (user) return user;

    return this.eventPublisher.mergeObjectContext(
      await this.userFactory.create({
        emailAddress: googleUser.email,
        name: googleUser.name,
        strategy: AuthStrategy.Google,
        avatarImageUrl: googleUser.picture,
      }),
    );
  }

  async execute(command: ConnectWithGoogleCommand) {
    const { code } = command;
    if (!code) throw new MissingOAuthCode();

    const responseTokens =
      await this.googleService.getGoogleTokensFromOAuthCode(code);
    const googleUser = await this.googleService.getGoogleUser(responseTokens);

    if (!googleUser.verified_email) throw new EmailNotVerifiedException();

    const user = await this.getOrRegisterUser(googleUser);

    const autheticationTokens =
      await this.googleService.createAuthenticationTokens(user.userId);

    user.commit();

    return autheticationTokens;
  }
}
