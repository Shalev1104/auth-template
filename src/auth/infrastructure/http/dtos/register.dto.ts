import { EmailAddress } from '@auth/domain/value-objects/EmailAddress';
import { PlainPassword } from '@auth/domain/value-objects/Password';
import { Phone } from '@auth/domain/value-objects/Phone';
import { AvatarImageUrl, Name } from '@auth/domain/value-objects/UserProfile';
import { z } from 'zod';

export const RegisterDto = z.object({
  emailAddress: EmailAddress,
  name: Name,
  avatarImageUrl: AvatarImageUrl,
  phone: Phone,
  password: PlainPassword,
});
export type RegisterDto = z.infer<typeof RegisterDto>;
