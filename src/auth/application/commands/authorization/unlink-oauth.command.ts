import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { ProviderNotLinkedException } from '@auth/domain/exceptions/oauth/provider-not-linked.exception';
import { NotAllowedToUnlinkException } from '@auth/domain/exceptions/oauth/not-allowed-to-unlink.exception';
import OAuth2Service from '@auth/infrastructure/oauth/oauth2.service';
import { User, UserId } from '@auth/domain/User.aggregate';
import { RemovedSocialLoginEvent } from '@auth/domain/events/removed-social-login.event';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';

export class UnlinkOAuthCommand<T, U> implements ICommand {
  constructor(
    public readonly userId: UserId,
    public readonly oauth2: OAuth2Service<T, U>,
  ) {}
}
export type UnlinkOAuthCommandResult = Promise<void>;

@CommandHandler(UnlinkOAuthCommand)
export class UnlinkOAuthCommandHandler<T, U>
  implements ICommandHandler<UnlinkOAuthCommand<T, U>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UnlinkOAuthCommand<T, U>): UnlinkOAuthCommandResult {
    const { userId, oauth2 } = command;

    const authenticatedUser = this.eventPublisher.mergeObjectContext(
      User.getOrFail(await this.userRepository.getUserById(userId)),
    );

    const linkedOAuth = authenticatedUser.oAuthLogin.get(oauth2.provider);
    if (!linkedOAuth) throw new ProviderNotLinkedException();

    authenticatedUser.oAuthLogin.delete(linkedOAuth);
    authenticatedUser.apply(
      new RemovedSocialLoginEvent(authenticatedUser, oauth2.provider),
    );
    if (
      authenticatedUser.oAuthLogin.isEmpty() &&
      !authenticatedUser.emailAndPasswordLogin
    )
      throw new NotAllowedToUnlinkException();

    await this.userRepository.save(authenticatedUser);
    authenticatedUser.commit();
  }
}
