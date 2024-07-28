import { CookieOptions } from 'express';

export enum Cookies {
  AccessToken = 'access',
  RefreshToken = 'refresh',
  Setup2FA = '2fa-setup',
  Login2FA = '2fa-login',
}

export const authCookieOptions: CookieOptions = {
  httpOnly: true, // No JS alterations
  signed: true, // Sign cookies security
  // sameSite: 'strict', // Restrict to same site only
  secure: process.env.NODE_ENV === 'production', // HTTPS connections
};
