import { z } from 'zod';

export const BearerToken = z
  .string()
  .refine((token) => token.startsWith('Bearer '), 'Invalid Bearer token');
export type BearerToken = z.infer<typeof BearerToken>;

export const AccessToken = z.string();
export type AccessToken = z.infer<typeof AccessToken>;

export const RefreshToken = z.string();
export type RefreshToken = z.infer<typeof RefreshToken>;

export const AuthenticationTokens = z.tuple([AccessToken, RefreshToken]);
export type AuthenticationTokens = z.infer<typeof AuthenticationTokens>;
