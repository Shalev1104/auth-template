import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { z } from 'zod';
import { EmailAddress } from './EmailAddress';

export const { enum: LoginProvider } = z.nativeEnum({
  ...OAuthProvider,
  EmailAndPassword: z.literal('EmailAndPassword').value,
});
export type LoginProvider = keyof typeof LoginProvider;

export const LoginAccount = z.object({
  loginProvider: z.nativeEnum(LoginProvider),
  emailAddress: z.optional(EmailAddress),
});
export type LoginAccount = z.infer<typeof LoginAccount>;
