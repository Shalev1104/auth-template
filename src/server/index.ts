import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { setupSecurity } from './security';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  app.setGlobalPrefix('/api');

  setupSecurity(app);

  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 3000;
  await app.listen(port, () => console.log(`Api is listening on port ${port}`));
}
bootstrap();
