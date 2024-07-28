import { z } from 'zod';
import { Environment } from '@server/environment';

export const StringToNumber = z
  .custom<number>()
  .refine((value) => +value)
  .transform((value) => Number(value));

export const envSchemaValidation = z.object({
  NODE_ENV: z.nativeEnum(Environment),
  PORT: StringToNumber.default(5433),

  POSTGRES_CLIENT: z.string(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: StringToNumber.default(3000),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PASS: z.string(),
  REDIS_PORT: StringToNumber.default(6381),

  TOKEN_SECRET: z.string(),
  COOKIE_PARSER_SECRET: z.string(),

  CORS_ALLOW_ORIGINS: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  FACEBOOK_CLIENT_ID: z.string(),
  FACEBOOK_CLIENT_SECRET: z.string(),

  MAIL_SERVICE: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: StringToNumber.default(465),
  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_FROM: z.string(),

  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
});
