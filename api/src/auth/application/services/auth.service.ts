import { InvalidTokenException } from '@auth/domain/exceptions/invalid-token.exception';
import { TokenVerifyFailedException } from '@auth/domain/exceptions/token-verify-failed.exception';
import { Uuid } from '@common/ddd/uuid';
import { Cookies, authCookieOptions } from '@common/http/cookies';
import { Request, Response } from 'express';
import {
  AccessToken,
  RefreshToken,
  TokenPayload,
  BearerToken,
  AccessTokenOrRefreshToken,
  JWTDecodedToken,
} from '@common/http/tokens';
import { UserId } from '@common/http/user';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

enum TokenExpirationInSeconds {
  Access = 20 * 60, // Every 20 minutes
  Refresh = 7 * 24 * 60 * 60, // Every one week
}

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  async createAuthenticationTokens(
    userId: UserId,
  ): Promise<[AccessToken, RefreshToken]> {
    try {
      const accessTokenPayload: TokenPayload<AccessToken> = {
        userId: userId.toString(),
      };
      const refreshTokenPayload: TokenPayload<RefreshToken> = {
        userId: userId.toString(),
      };

      const accessToken = this.jwtService.sign(accessTokenPayload, {
        secret: this.accessTokenSecret,
        expiresIn: TokenExpirationInSeconds.Access,
      });
      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        secret: this.refreshTokenSecret,
        expiresIn: TokenExpirationInSeconds.Refresh,
      });
      return [accessToken, refreshToken];
    } catch {
      throw new InternalServerErrorException();
    }
  }

  extractAuthorizationHeaderFromRequest(request: Request) {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) throw new UnauthorizedException('Not logged in');

    return authorizationHeader;
  }

  extractBearerTokenFromAuthorizationHeader(authorizationHeader: string) {
    if (!BearerToken.validate(authorizationHeader))
      throw new InvalidTokenException();

    return BearerToken.fromBearerToken(authorizationHeader);
  }

  setAuthenticationTokensToResponseCookie(
    response: Response,
    accessToken: AccessToken,
    refreshToken?: RefreshToken,
  ) {
    response.setHeader(
      'Authorization',
      BearerToken.fromToken(accessToken).toString(),
    );

    response.cookie(Cookies.AccessToken, accessToken, {
      ...authCookieOptions,
      maxAge: TokenExpirationInSeconds.Access * 1000,
    });

    if (refreshToken)
      response.cookie(Cookies.RefreshToken, refreshToken, {
        ...authCookieOptions,
        maxAge: TokenExpirationInSeconds.Refresh * 1000,
      });
  }

  clearAuthenticationTokens(response: Response) {
    response.clearCookie(Cookies.AccessToken);
    response.clearCookie(Cookies.RefreshToken);
  }

  private async verifyToken<Token extends AccessTokenOrRefreshToken>(
    token: Token,
    tokenSecret: string,
  ): Promise<JWTDecodedToken<Token>> {
    try {
      const decodedToken = await this.jwtService.verify(token, {
        secret: tokenSecret,
      });
      return decodedToken;
    } catch (e) {
      throw new TokenVerifyFailedException();
    }
  }

  async verifyAccessToken(
    accessToken: AccessToken,
  ): Promise<JWTDecodedToken<AccessToken>> {
    return this.verifyToken(accessToken, this.accessTokenSecret);
  }

  async verifyRefreshToken(
    refreshToken: RefreshToken,
  ): Promise<JWTDecodedToken<RefreshToken>> {
    return this.verifyToken(refreshToken, this.refreshTokenSecret);
  }

  async isAuthenticated(request: Request) {
    const decodedUserIdFromToken = await this.getAuthenticatedUser(request);
    if (!decodedUserIdFromToken) return false;
    return true;
  }

  async getAuthenticatedUser(request: Request): Promise<UserId> {
    const userAccessToken = this.getAccessTokenFromCookie(request);
    const machineAccessToken =
      !userAccessToken && this.getAccessTokenFromAuthorizationHeader(request);

    const { userId } = await this.verifyAccessToken(
      userAccessToken || machineAccessToken,
    );
    return new Uuid(userId);
  }

  private getAccessTokenFromAuthorizationHeader(request: Request) {
    const authorizationHeader =
      this.extractAuthorizationHeaderFromRequest(request);
    const accessToken =
      this.extractBearerTokenFromAuthorizationHeader(authorizationHeader);
    return accessToken;
  }

  private getAccessTokenFromCookie(request: Request) {
    return request.signedCookies[Cookies.AccessToken];
  }

  private get accessTokenSecret() {
    return String(process.env.ACCESS_TOKEN_SECRET);
  }

  private get refreshTokenSecret() {
    return String(process.env.ACCESS_TOKEN_SECRET);
  }
}
