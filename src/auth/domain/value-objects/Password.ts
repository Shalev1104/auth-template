import { z } from 'zod';

const AtLeastOneLowerLetterRegex = /(?=.*[a-z])/;
const AtLeastOneUpperLetterRegex = /(?=.*[A-Z])/;
const AtLeastOneDigitRegex = /\d/;

export const PlainPassword = z
  .string()
  .refine(
    (password) => password.length >= 8,
    'Password should contain at least 8 characters',
  )
  .refine(
    (password) => AtLeastOneLowerLetterRegex.test(password),
    'Password should contain at least one lower letter',
  )
  .refine(
    (password) => AtLeastOneUpperLetterRegex.test(password),
    'Password should contain at least one upper letter',
  )
  .refine(
    (password) => AtLeastOneDigitRegex.test(password),
    'Password should contain at least one digit',
  );

export type PlainPassword = z.infer<typeof PlainPassword>;

export const HashedPassword = z.string();

export type HashedPassword = z.infer<typeof HashedPassword>;
