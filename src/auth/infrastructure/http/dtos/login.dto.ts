import { EmailAddress } from '@auth/domain/value-objects/EmailAddress';
import { PlainPassword } from '@auth/domain/value-objects/Password';
import { z } from 'zod';

export const LoginDto = z.object({
  emailAddress: EmailAddress,
  password: PlainPassword,
});
export type LoginDto = z.infer<typeof LoginDto>;
