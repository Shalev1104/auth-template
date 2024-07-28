import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { UserFactory } from '@auth/application/factories/user.factory';
import { MissingOAuthCodeException } from '@auth/domain/exceptions/OAuth/missing-oauth-code.exception';
import { AuthenticationService } from '@auth/application/services/authentication.service';
import OAuth2Service from '@auth/infrastructure/oauth/oauth2.service';
import { User, UserId } from '@auth/domain/User.aggregate';
import { OAuthLogin } from '@auth/domain/entities/OAuthLogin.entity';
import { AddedSocialLoginEvent } from '@auth/domain/events/added-social-login.event';
import { UserAlreadyLinkedException } from '@auth/domain/exceptions/oauth/user-already-linked.exception';
import { ProviderAlreadyLinkedException } from '@auth/domain/exceptions/oauth/provider-already-linked.exception';
import { MismatchStateException } from '@auth/domain/exceptions/oauth/incorrect-oauth-state.exception';
import { AuthenticationTokens } from '@auth/domain/value-objects/Tokens';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { Inject } from '@nestjs/common';

export class ConnectWithOAuthCommand<T, U> implements ICommand {
  constructor(
    public readonly oauth2: OAuth2Service<T, U>,
    public readonly code: string,
    public readonly state: string,
    public readonly cookies: Record<string, unknown>,
    public readonly userId?: UserId,
  ) {}
}

export type ConnectWithOAuthCommandResult = Promise<AuthenticationTokens>;

@CommandHandler(ConnectWithOAuthCommand)
export class ConnectWithOAuthCommandHandler<T, U>
  implements ICommandHandler<ConnectWithOAuthCommand<T, U>>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly userFactory: UserFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(
    command: ConnectWithOAuthCommand<T, U>,
  ): ConnectWithOAuthCommandResult {
    const { oauth2, code, state, cookies, userId } = command;

    if (!code) throw new MissingOAuthCodeException();
    if (!(state in cookies)) throw new MismatchStateException();

    const token = await oauth2.getToken(code);
    const authorization = await oauth2.getAuthorization(token);

    const user = userId
      ? await this.linkOAuth(oauth2, authorization, userId)
      : await this.loginOAuth(oauth2, authorization);

    await this.userRepository.save(user);
    user.commit();

    return await this.authenticationService.createAuthenticationTokens(user);
  }

  async loginOAuth(oauth2: OAuth2Service<T, U>, authorization: T) {
    const authorizationId = oauth2.getAuthorizationId(authorization);

    const existingUser = await this.userRepository.getUserByOAuthId(
      authorizationId,
      oauth2.provider,
    );

    const oAuthUser = this.eventPublisher.mergeObjectContext(
      existingUser ??
        (await this.userFactory.createUser(oauth2.provider, authorization)),
    );

    oAuthUser.updateLastLogin();
    return oAuthUser;
  }

  async linkOAuth(
    oauth2: OAuth2Service<T, U>,
    authorization: T,
    userId: UserId,
  ) {
    const authenticatedUser = this.eventPublisher.mergeObjectContext(
      User.getOrFail(await this.userRepository.getUserById(userId)),
    );

    if (authenticatedUser.oAuthLogin.has(oauth2.provider))
      throw new ProviderAlreadyLinkedException();

    if (
      await this.userRepository.getUserByOAuthId(
        oauth2.getAuthorizationId(authorization),
        oauth2.provider,
      )
    )
      throw new UserAlreadyLinkedException();

    authenticatedUser.oAuthLogin.add(
      new OAuthLogin({
        providerId: oauth2.getAuthorizationId(authorization),
        providerName: oauth2.provider,
        data: {
          emailAddress: oauth2.getAuthorizationEmail(authorization),
          avatarImageUrl: oauth2.getAvatarImageUrl(authorization),
        },
      }),
    );
    authenticatedUser.apply(
      new AddedSocialLoginEvent(authenticatedUser, oauth2.provider),
    );

    return authenticatedUser;
  }
}
