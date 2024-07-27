import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InvalidAuthorizationCodeException } from '@auth/domain/exceptions/OAuth/invalid-authorization-code.exception';
import { IGithubAuthorization } from '@auth/infrastructure/oauth/github/github.authorization';
import { IGithubToken } from '@auth/infrastructure/oauth/github/github.tokens';
import { AuthenticationService } from '../../../application/services/authentication.service';
import { TokenVerifyFailedException } from '@auth/domain/exceptions/Tokens/token-verify-failed.exception';
import OAuth2Service from '../oauth2.service';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';

@Injectable()
export class GithubService extends OAuth2Service<
  IGithubAuthorization,
  IGithubToken
> {
  constructor(
    private httpService: HttpService,
    private authenticationService: AuthenticationService,
  ) {
    super(OAuthProvider.Github);
  }

  getLoginUrl(): string {
    const requestOptions = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      path: '/',
      scope: 'user:email',
      state: this.state,
    });
    return `https://github.com/login/oauth/authorize?${requestOptions.toString()}`;
  }

  async getToken(code: string): Promise<IGithubToken> {
    const request = this.httpService.axiosRef.post<IGithubToken>(
      this.githubAccessTokenUrl,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    try {
      const response = await request;
      const accessToken = response.data;
      return accessToken;
    } catch {
      throw new InvalidAuthorizationCodeException();
    }
  }

  async getAuthorization({
    access_token,
  }: IGithubToken): Promise<IGithubAuthorization> {
    const request = this.httpService.axiosRef.get<IGithubAuthorization>(
      this.githubUserUrl,
      {
        headers: {
          Authorization:
            this.authenticationService.createBearerToken(access_token),
        },
      },
    );

    try {
      const response = await request;
      const githubUser = response.data;
      return githubUser;
    } catch {
      throw new TokenVerifyFailedException();
    }
  }

  getAuthorizationId(authorization: IGithubAuthorization) {
    return authorization.id.toString();
  }
  getAuthorizationEmail(authorization: IGithubAuthorization) {
    return authorization.email;
  }
  getAvatarImageUrl(authorization: IGithubAuthorization) {
    return authorization.avatar_url;
  }

  private get githubAccessTokenUrl() {
    return 'https://github.com/login/oauth/access_token';
  }

  private get githubUserUrl() {
    return 'https://api.github.com/user';
  }
}
