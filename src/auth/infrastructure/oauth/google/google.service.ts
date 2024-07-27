import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InvalidAuthorizationCodeException } from '@auth/domain/exceptions/oauth/invalid-authorization-code.exception';
import { IGoogleAuthorization } from '@auth/infrastructure/oauth/google/google.authorization';
import { IGoogleToken } from '@auth/infrastructure/oauth/google/google.tokens';
import { AuthenticationService } from '../../../application/services/authentication.service';
import { TokenVerifyFailedException } from '@auth/domain/exceptions/Tokens/token-verify-failed.exception';
import OAuth2Service from '../oauth2.service';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';

@Injectable()
export class GoogleService extends OAuth2Service<
  IGoogleAuthorization,
  IGoogleToken
> {
  constructor(
    private httpService: HttpService,
    private authenticationService: AuthenticationService,
  ) {
    super(OAuthProvider.Google);
  }

  getLoginUrl(): string {
    const requestOptions = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      state: this.state,
      scope: ['email', 'profile', 'openid'].join(' '),
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${requestOptions.toString()}`;
  }

  async getToken(authorizationCode: string): Promise<IGoogleToken> {
    const request = this.httpService.axiosRef.post<IGoogleToken>(
      'https://oauth2.googleapis.com/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: authorizationCode,
        redirect_uri: this.redirectUrl,
        grant_type: 'authorization_code',
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
      const googleTokens = response.data;
      return googleTokens;
    } catch {
      throw new InvalidAuthorizationCodeException();
    }
  }

  async getAuthorization({
    id_token,
    access_token,
  }: IGoogleToken): Promise<IGoogleAuthorization> {
    const requestQueryString = new URLSearchParams({
      access_token,
      alt: 'json',
    });
    const googleUserUrl = `https://www.googleapis.com/oauth2/v1/userinfo?${requestQueryString.toString()}`;
    const request = this.httpService.axiosRef.get<IGoogleAuthorization>(
      googleUserUrl,
      {
        headers: {
          Authorization: this.authenticationService.createBearerToken(id_token),
        },
      },
    );

    try {
      const response = await request;
      const googleUser = response.data;
      return googleUser;
    } catch {
      throw new TokenVerifyFailedException();
    }
  }

  getAuthorizationId(authorization: IGoogleAuthorization) {
    return authorization.id;
  }
  getAuthorizationEmail(authorization: IGoogleAuthorization) {
    return authorization.email;
  }
  getAvatarImageUrl(authorization: IGoogleAuthorization) {
    return authorization.picture;
  }
}
