export interface GithubCodeToAccessTokenResponse {
  access_token: string;
}

export interface GoogleTokensResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
