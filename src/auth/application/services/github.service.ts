import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { catchError, lastValueFrom, map } from 'rxjs';
import { InvalidTokenException } from '@auth/domain/exceptions/invalid-token.exception';
import { GithubCodeToAccessTokenResponse } from '@common/infrastructure/http/tokens';
import { GithubUser } from '@auth/domain/strategies/github.strategy';
import { InvalidOAuthCodeException } from '@auth/domain/exceptions/invalid-oauth-code.exception';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from '@auth/domain/value-objects/Tokens';

@Injectable()
export class GithubService extends AuthenticationService {
  constructor(
    protected configService: ConfigService,
    protected jwtService: JwtService,
    private httpService: HttpService,
  ) {
    super(configService, jwtService);
  }

  async getGithubAccessToken(code: string): Promise<AccessToken> {
    const request = this.httpService
      .post<GithubCodeToAccessTokenResponse>(
        this.githubAccessTokenUrl,
        {
          client_id: this.githubClientId,
          client_secret: this.githubClientSecret,
          code,
        },
        {
          headers: { Accept: 'applcation/json' },
        },
      )
      .pipe(map((response) => response.data.access_token))
      .pipe(
        catchError(() => {
          throw new InvalidOAuthCodeException();
        }),
      );

    const response = await lastValueFrom(request);
    return response;
  }

  async getGithubUserFromAccessToken(
    accessToken: AccessToken,
  ): Promise<GithubUser> {
    const request = this.httpService
      .get<GithubUser>(this.githubUserUrl, {
        headers: {
          Authorization: this.createBearerToken(accessToken),
        },
      })
      .pipe(map((response) => response.data))
      .pipe(
        catchError(() => {
          throw new InvalidTokenException();
        }),
      );

    const response = await lastValueFrom(request);
    return response;
  }

  private get githubAccessTokenUrl() {
    return 'https://github.com/login/oauth/access_token';
  }

  private get githubUserUrl() {
    return 'https://api.github.com/user';
  }

  private get githubClientId() {
    return String(process.env.GITHUB_CLIENT_ID);
  }

  private get githubClientSecret() {
    return String(process.env.GITHUB_CLIENT_SECRET);
  }
}
