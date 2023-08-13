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

export interface GithubCodeToAccessTokenResponse {
  access_token: string;
}
