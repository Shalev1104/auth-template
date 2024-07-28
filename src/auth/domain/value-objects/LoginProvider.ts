import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { z } from 'zod';
import { EmailAddress } from './EmailAddress';
import { AvatarImageUrl } from './UserProfile';

export const { enum: LoginProvider } = z.nativeEnum({
  ...OAuthProvider,
  EmailAndPassword: z.literal('EmailAndPassword').value,
});
export type LoginProvider = keyof typeof LoginProvider;

export const LoginAccount = z.object({
  loginProvider: z.nativeEnum(LoginProvider),
  emailAddress: z.optional(EmailAddress),
  avatarImageUrl: z.optional(AvatarImageUrl),
});
export type LoginAccount = z.infer<typeof LoginAccount>;
