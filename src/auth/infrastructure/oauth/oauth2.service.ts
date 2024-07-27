import { EmailAddress } from '@auth/domain/value-objects/EmailAddress';
import { AvatarImageUrl } from '@auth/domain/value-objects/UserProfile';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { authCookieOptions } from '@common/infrastructure/http/cookies';
import { Response } from 'express';
import * as nanoid from 'nanoid';

export default abstract class OAuth2Service<TAuthorization, TToken> {
  protected readonly state;
  constructor(public readonly provider: OAuthProvider) {
    this.state = this.generateState();
  }

  protected get redirectUrl() {
    return `http://localhost:3000/api/auth/oauth/connect/${this.provider.toLowerCase()}/callback`;
  }

  protected get clientId() {
    return String(process.env[`${this.provider.toUpperCase()}_CLIENT_ID`]);
  }

  protected get clientSecret() {
    return String(process.env[`${this.provider.toUpperCase()}_CLIENT_SECRET`]);
  }

  protected generateState() {
    return nanoid.nanoid(15);
  }

  setOAuthStateToResponseCookie(response: Response, clientRedirectUrl = '/') {
    response.cookie(
      this.state,
      new URL(clientRedirectUrl, process.env.APP_URL),
      {
        ...authCookieOptions,
        maxAge: 1000 * 60 * 15,
      },
    );
  }

  abstract getAuthorizationId(authorization: TAuthorization): string;
  abstract getAuthorizationEmail(
    authorization: TAuthorization,
  ): EmailAddress | undefined;
  abstract getAvatarImageUrl(
    authorization: TAuthorization,
  ): AvatarImageUrl | undefined;

  /**
   * @param provider - The OAuth provider to get the login URL for.
   * @returns The login URL for the specified OAuth provider.
   */
  abstract getLoginUrl(provider: OAuthProvider): string;

  /**
   * @param authorizationCode
   * @returns A promise of the obtained token.
   * @throws InvalidAuthorizationCodeException if the request fails.
   */
  abstract getToken(authorizationCode: string): Promise<TToken>;

  /**
   * @param tokens - The OAuth tokens used for getting authorized user.
   * @returns A promise of the OAuth authorization data.
   * @throws TokenVerifyFailedException if the request fails.
   */
  abstract getAuthorization(tokens: TToken): Promise<TAuthorization>;
}
