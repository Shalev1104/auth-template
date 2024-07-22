import * as Joi from 'joi';

export const configSchemaValidation = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(3000).required(),

  POSTGRES_DATABASE_URL: Joi.string().required(),
  MONGO_DATABASE_URL: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PASS: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6381).required(),

  ACCESS_TOKEN_SECRET: Joi.string().required(),
  COOKIE_PARSER_SECRET: Joi.string().required(),

  LOG_FILE_PATH: Joi.string().default('./logs').required(),

  CORS_ALLOW_ORIGINS: Joi.string().required(),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().default(465).required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().required(),
});
