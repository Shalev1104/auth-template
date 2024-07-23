import { z } from 'zod';

export const EmailAddress = z.string().email().trim().toLowerCase();
export type EmailAddress = z.infer<typeof EmailAddress>;
