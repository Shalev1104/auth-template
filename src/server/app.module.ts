import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { envSchemaValidation } from '@server/env-schema.validator';
import { DatabaseModule } from '@common/infrastructure/database/database.module';
import { AuthModule } from '@auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommunicationsModule } from '@common/infrastructure/communications/communications.module';
import { UserMiddleware } from '@common/infrastructure/http/middlewares/user.middleware';
import { AuthenticationService } from '@auth/application/services/authentication.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: envSchemaValidation.parse,
    }),
    CqrsModule,
    DatabaseModule,
    CommunicationsModule,
    AuthModule,
  ],
  providers: [AuthenticationService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
