import { TokenVerifyFailedException } from '@auth/domain/exceptions/tokens/token-verify-failed.exception';
import {
  Cookies,
  authCookieOptions,
} from '@common/infrastructure/http/cookies';
import { Request, Response } from 'express';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@auth/domain/User.aggregate';
import {
  AccessToken,
  RefreshToken,
  BearerToken,
  AuthenticationTokens,
} from '@auth/domain/value-objects/Tokens';
import { validateSchema } from '@common/domain/entity-validate';
import { NotAuthenticatedException } from '@auth/domain/exceptions/not-authenticated.exception';
import {
  Claims,
  MaybeClaims,
} from '@common/infrastructure/http/decorators/authenticate.decorator';
import { v4 } from 'uuid';

enum TokenExpirationInSeconds {
  Access = 15 * 60, // Every 15 minutes
  Refresh = 7 * 24 * 60 * 60, // Every one week
}

interface RefreshTokenPayload {
  sub: string;
  refresh_count: number;
  jti: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    protected configService: ConfigService,
    protected jwtService: JwtService,
  ) {}

  async createAuthenticationTokens(
    user: User,
    refreshTokenCount = 0,
  ): Promise<AuthenticationTokens> {
    try {
      const jwtId = v4();
      const accessTokenPayload: Claims = {
        sub: user.userId,
        name: user.name,
        accounts: user.getLoginAccounts(),
        iss: this.configService.get('APP_URL').toString(),
        jti: jwtId,
        aud: [this.configService.get('APP_URL').toString()],
        '2fa': !!user.emailAndPasswordLogin?.isEnabled2FA(),
      };
      const refreshTokenPayload: RefreshTokenPayload = {
        sub: user.userId,
        refresh_count: refreshTokenCount,
        jti: jwtId,
      };

      const accessToken = this.jwtService.sign(accessTokenPayload, {
        secret: this.tokenSecret,
        expiresIn: TokenExpirationInSeconds.Access,
      });
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        secret: this.tokenSecret,
        expiresIn: TokenExpirationInSeconds.Refresh,
      });
      return [accessToken, refreshToken];
    } catch {
      throw new InternalServerErrorException();
    }
  }

  extractAuthorizationHeaderFromRequest(request: Request) {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) throw new NotAuthenticatedException();
    return authorizationHeader;
  }

  extractBearerTokenFromAuthorizationHeader(authorizationHeader: string) {
    return validateSchema(BearerToken, authorizationHeader).split(' ')[1];
  }

  createBearerToken(token: string): BearerToken {
    return `Bearer ${token}`;
  }

  setAuthenticationTokensToResponseCookie(
    response: Response,
    accessToken: AccessToken,
    refreshToken: RefreshToken,
  ) {
    response.setHeader('Authorization', this.createBearerToken(accessToken));

    response.cookie(Cookies.AccessToken, accessToken, {
      ...authCookieOptions,
      maxAge: TokenExpirationInSeconds.Access * 1000,
    });
    response.cookie(Cookies.RefreshToken, refreshToken, {
      ...authCookieOptions,
      maxAge: TokenExpirationInSeconds.Refresh * 1000,
    });
  }

  clearAuthenticationTokens(response: Response) {
    response.clearCookie(Cookies.AccessToken).clearCookie(Cookies.RefreshToken);
  }

  private async verifyToken(
    token: AccessToken | RefreshToken,
    tokenSecret: string,
  ) {
    try {
      return await this.jwtService.verify(token, {
        secret: tokenSecret,
      });
    } catch {
      throw new TokenVerifyFailedException();
    }
  }

  async verifyAccessToken(accessToken: AccessToken): Promise<Claims> {
    return this.verifyToken(accessToken, this.tokenSecret);
  }

  async verifyRefreshToken(
    refreshToken: RefreshToken,
  ): Promise<RefreshTokenPayload> {
    return this.verifyToken(refreshToken, this.tokenSecret);
  }

  async getAuthenticatedUser(request: Request): Promise<MaybeClaims> {
    try {
      const userAccessToken = this.getAccessTokenFromCookie(request);
      const machineAccessToken =
        !userAccessToken && this.getAccessTokenFromAuthorizationHeader(request);

      return await this.verifyAccessToken(
        userAccessToken || machineAccessToken,
      );
    } catch {
      return null;
    }
  }

  getAccessTokenFromAuthorizationHeader(request: Request) {
    const authorizationHeader =
      this.extractAuthorizationHeaderFromRequest(request);
    const accessToken =
      this.extractBearerTokenFromAuthorizationHeader(authorizationHeader);
    return accessToken;
  }

  getAccessTokenFromCookie(request: Request) {
    return request.signedCookies[Cookies.AccessToken];
  }

  private get tokenSecret(): string {
    return this.configService.get('TOKEN_SECRET').toString();
  }
}
