import { UserId } from '@auth/domain/User.aggregate';
import { LoginAccount } from '@auth/domain/value-objects/LoginProvider';
import { Phone } from '@auth/domain/value-objects/Phone';
import { AvatarImageUrl, Name } from '@auth/domain/value-objects/UserProfile';
import { z } from 'zod';

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
