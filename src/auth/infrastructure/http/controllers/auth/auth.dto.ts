import { EmailAddress } from '@auth/domain/value-objects/EmailAddress';
import { PlainPassword } from '@auth/domain/value-objects/Password';
import { z } from 'zod';
import { Phone } from '@auth/domain/value-objects/Phone';
import { AvatarImageUrl, Name } from '@auth/domain/value-objects/UserProfile';
import { UserId } from '@auth/domain/User.aggregate';
import { LoginAccount } from '@auth/domain/value-objects/LoginProvider';

export const RegisterDto = z.object({
  emailAddress: EmailAddress,
  name: Name,
  avatarImageUrl: AvatarImageUrl,
  phone: Phone,
  password: PlainPassword,
});
export type RegisterDto = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
  emailAddress: z.string(),
  password: z.string(),
});
export type LoginDto = z.infer<typeof LoginDto>;

export const UserResponseDto = z.object({
  userId: UserId,
  name: Name,
  avatarImageUrl: AvatarImageUrl,
  lastLoginAt: z.date(),
  phone: Phone,
  createdAt: z.date(),
  accounts: z.array(LoginAccount),
});
export type UserResponseDto = z.infer<typeof UserResponseDto>;
