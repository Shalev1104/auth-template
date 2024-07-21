import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ['Authorization', 'Location'],
    maxAge: 600,
  });

  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
  app.useBodyParser('json', { limit: '64mb' });
  app.useLogger(new Logger());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove request body that not appeared in dto
      transform: true, // transform the request object to fit dto
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  await app.listen(process.env.PORT || 3000, () =>
    console.log(`Api is listening on port ${process.env.PORT}`),
  );
}
bootstrap();
