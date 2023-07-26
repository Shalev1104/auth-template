import * as Joi from 'joi';

export const configSchemaValidation = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.number().default(3000).required(),

  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASS: Joi.string().required(),
  POSTGRES_DATABASE: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432).required(),

  MONGO_URI: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PASS: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6381).required(),

  TOKEN_SECRET: Joi.string().required(),

  LOG_FILE_PATH: Joi.string().default('./logs').required(),

  CORS_ALLOW_ORIGINS: Joi.string().required(),
});
