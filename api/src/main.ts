import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as csurf from 'csurf';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    exposedHeaders: 'Location',
    maxAge: 600,
  });

  app.use(helmet(), csurf());
  app.useBodyParser('json', { limit: '64mb' });
  app.useLogger(new Logger());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove request body that not appeared in dto
    }),
  );

  await app.listen(process.env.PORT, () =>
    console.log(`Api is listening on port ${process.env.PORT}`),
  );
}
bootstrap();
