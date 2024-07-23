import { z } from 'zod';

const Base32Regex = /^[A-Z2-7]+=*$/;
export const SharedSecret = z
  .string()
  .regex(Base32Regex, 'Invalid base 32 secret')
  .optional();

export type SharedSecret = z.infer<typeof SharedSecret>;
