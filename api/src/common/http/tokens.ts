export type AccessToken = string;
export type RefreshToken = string;

export type AccessTokenOrRefreshToken = AccessToken | RefreshToken;

interface AccessTokenPayload {
  userId: string;
}

interface RefreshTokenPayload {
  userId: string;
}

export type TokenPayload<T extends AccessTokenOrRefreshToken> =
  T extends AccessToken ? AccessTokenPayload : RefreshTokenPayload;

export type JWTDecodedToken<T extends AccessTokenOrRefreshToken> =
  TokenPayload<T> & {
    iat: number; // Issued at
    exp: number; // Expires In
  };

export class BearerToken extends String {
  constructor(token: string) {
    super(`Bearer ${token}`);
  }

  static fromBearerToken(bearerToken: BearerToken): AccessTokenOrRefreshToken {
    return bearerToken.split(' ')[1];
  }

  static fromToken(token: AccessTokenOrRefreshToken): BearerToken {
    return new BearerToken(token);
  }

  static validate(token: unknown): token is BearerToken {
    const bearerScheme =
      /^Bearer (?<token>[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)$/;
    return typeof token === 'string' && bearerScheme.test(token);
  }
}
