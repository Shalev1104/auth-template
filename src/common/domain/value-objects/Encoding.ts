import { z } from 'zod';

export const Base32 = z
  .string()
  .regex(/^[A-Z2-7]+=*$/, 'invalid base 32 string');
export type Base32 = z.infer<typeof Base32>;
