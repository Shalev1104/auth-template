import { z } from 'zod';

export const Name = z.string();
export type Name = z.infer<typeof Name>;

export const AvatarImageUrl = z.string().optional();
export type AvatarImageUrl = z.infer<typeof AvatarImageUrl>;

export const UserProfile = z.object({
  name: Name,
  avatarImageUrl: AvatarImageUrl,
});
export type UserProfile = z.infer<typeof UserProfile>;
