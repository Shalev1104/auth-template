import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Environment } from './environment';
// import * as csurf from 'csurf';

export function setupSecurity(app: NestExpressApplication): void {
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ALLOW_ORIGINS'),
    credentials: true,
    exposedHeaders: ['Authorization', 'Location'],
    maxAge: 600,
  });

  app.use(cookieParser(configService.get('COOKIE_PARSER_SECRET')));
  app.useBodyParser('json', { limit: '64mb' });

  // app.use(csurf({}));
  app.use(
    rateLimit({
      windowMs: configService.get('TTL_IN_MILLISECONDS'),
      max: configService.get('REQUEST_LIMIT_PER_TTL'),
      message:
        'You have exceeded the number of allowed requests. Please try again after 5 minutes',
    }),
  );

  if (configService.get('NODE_ENV') === Environment.Production) {
    app.use(
      helmet.hsts({
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
      }),
    );
  }
}
