import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InvalidAuthorizationCodeException } from '@auth/domain/exceptions/oauth/invalid-authorization-code.exception';
import { AuthenticationService } from '../../../application/services/authentication.service';
import { IFacebookToken } from './facebook.tokens';
import { IFacebookAuthorization } from './facebook.authorization';
import { TokenVerifyFailedException } from '@auth/domain/exceptions/tokens/token-verify-failed.exception';
import OAuth2Service from '../oauth2.service';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';

@Injectable()
export class FacebookService extends OAuth2Service<
  IFacebookAuthorization,
  IFacebookToken
> {
  constructor(
    private httpService: HttpService,
    private authenticationService: AuthenticationService,
  ) {
    super(OAuthProvider.Facebook);
  }

  getLoginUrl(): string {
    const requestOptions = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: 'code',
      scope: 'public_profile,email',
      state: this.state,
    });
    return `https://www.facebook.com/v18.0/dialog/oauth?${requestOptions.toString()}`;
  }

  async getToken(authorizationCode: string): Promise<IFacebookToken> {
    const request = this.httpService.axiosRef.post<IFacebookToken>(
      this.facebookAccessTokenUrl,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: authorizationCode,
        redirect_uri:
          'http://localhost:3000/api/auth/oauth/connect/facebook/callback',
      },
      {
        headers: {
          Accept: 'applcation/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    try {
      const response = await request;
      const facebookTokens = response.data;
      return facebookTokens;
    } catch {
      throw new InvalidAuthorizationCodeException();
    }
  }

  async getAuthorization({
    access_token,
  }: IFacebookToken): Promise<IFacebookAuthorization> {
    const request = this.httpService.axiosRef.get(this.facebookUserUrl, {
      headers: {
        Authorization:
          this.authenticationService.createBearerToken(access_token),
      },
    });

    try {
      const response = await request;
      const facebookUser = response.data;
      return facebookUser;
    } catch {
      throw new TokenVerifyFailedException();
    }
  }

  getAuthorizationId(authorization: IFacebookAuthorization) {
    return authorization.id;
  }
  getAuthorizationEmail(authorization: IFacebookAuthorization) {
    return authorization.email;
  }
  getAvatarImageUrl(authorization: IFacebookAuthorization) {
    return authorization.picture.data.url;
  }

  private get facebookUserUrl(): string {
    return 'https://graph.facebook.com/me?fields=name, picture, email';
  }

  private get facebookAccessTokenUrl(): string {
    return 'https://graph.facebook.com/v18.0/oauth/access_token';
  }
}
