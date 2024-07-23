import { z } from 'zod';

const PhoneNumberRegex = /^\+[1-9]\d{1,14}$/;
export const Phone = z
  .string()
  .regex(PhoneNumberRegex, 'Invalid phone number')
  .optional();

export type Phone = z.infer<typeof Phone>;
