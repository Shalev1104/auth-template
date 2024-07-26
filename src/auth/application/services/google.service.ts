import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GoogleTokensResponse } from '@common/infrastructure/http/tokens';
import { GoogleUser } from '@auth/domain/strategies/google.strategy';
import { InvalidTokenException } from '@auth/domain/exceptions/invalid-token.exception';
import { InvalidOAuthCodeException } from '@auth/domain/exceptions/invalid-oauth-code.exception';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from '@auth/domain/value-objects/Tokens';

@Injectable()
export class GoogleService extends AuthenticationService {
  constructor(
    protected configService: ConfigService,
    protected jwtService: JwtService,
    private httpService: HttpService,
  ) {
    super(configService, jwtService);
  }

  async getGoogleTokensFromOAuthCode(
    code: string,
  ): Promise<GoogleTokensResponse> {
    const request = this.httpService
      .post<GoogleTokensResponse>(
        this.googleAccessTokenUrl,
        {
          client_id: this.googleClientId,
          client_secret: this.googleClientSecret,
          code,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            Accept: 'applcation/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map((response) => response.data))
      .pipe(
        catchError(() => {
          throw new InvalidOAuthCodeException();
        }),
      );

    const response = await lastValueFrom(request);
    return response;
  }

  async getGoogleUser({
    id_token,
    access_token,
  }: GoogleTokensResponse): Promise<GoogleUser> {
    const request = this.httpService
      .get<GoogleUser>(this.googleUserUrl(access_token), {
        headers: {
          Authorization: this.createBearerToken(id_token),
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

  private googleUserUrl(accessToken: AccessToken): string {
    const requestQueryString = new URLSearchParams({
      access_token: accessToken,
      alt: 'json',
    });
    return `https://www.googleapis.com/oauth2/v1/userinfo?${requestQueryString.toString()}`;
  }

  private get googleAccessTokenUrl(): string {
    return 'https://oauth2.googleapis.com/token';
  }

  private get googleClientId(): string {
    return String(process.env.GOOGLE_CLIENT_ID);
  }

  private get googleClientSecret(): string {
    return String(process.env.GOOGLE_CLIENT_SECRET);
  }
}
