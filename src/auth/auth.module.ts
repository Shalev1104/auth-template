import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginCommandHandler } from './application/commands/identification/login.command';
import { RefreshAccessTokenCommandHandler } from './application/commands/authentication/refresh-access-token.command';
import { RegisterCommandHandler } from './application/commands/identification/register.command';
import { UserFactory } from './application/factories/user.factory';
import { GetAuthenticatedUserQueryHandler } from './application/queries/get-user-claims.query';
import { AuthenticationService } from './application/services/authentication.service';
import { EncryptionService } from './application/services/encryption.service';
import { UserRepository } from './infrastructure/database/user.db-repository';
import { UserMapper } from './infrastructure/database/user.mapper';
import { AuthController } from './infrastructure/http/auth.controller';
import { ConnectWithGithubCommandHandler } from './application/commands/connect-github.command';
import { GithubService } from './application/services/github.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '@common/infrastructure/database/database.module';
import { UserCreatedEventHandler } from './application/events/user-created.event';
import { GoogleService } from './application/services/google.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { OAuthLoginSchema } from '@common/infrastructure/database/typeorm/schemas/oAuthLogin.schema';
import { VerificationSchema } from '@common/infrastructure/database/typeorm/schemas/verifications.schema';
import { TwoFactorAuthenticationSchema } from '@common/infrastructure/database/typeorm/schemas/twoFactorAuthentication.schema';
import { OtpChannelSchema } from '@common/infrastructure/database/typeorm/schemas/otpChannel.schema';
import { CommunicationsModule } from '@common/infrastructure/communications/communications.module';
import { AuthMailService } from './infrastructure/mail/auth-mail.service';
import { ConfigModule } from '@nestjs/config';

const commands = [
  LoginCommandHandler,
  RegisterCommandHandler,
  RefreshAccessTokenCommandHandler,
  ConnectWithGithubCommandHandler,
];
const queries = [GetAuthenticatedUserQueryHandler];
const events = [UserCreatedEventHandler];
const services = [
  JwtService,
  AuthenticationService,
  EncryptionService,
  GoogleService,
  GithubService,
  AuthMailService,
];
const repositories = [UserRepository];
const mappers = [UserMapper];
const factories = [UserFactory];

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    ConfigModule,
    DatabaseModule,
    CommunicationsModule,
    TypeOrmModule.forFeature([
      UserSchema,
      OAuthLoginSchema,
      VerificationSchema,
      TwoFactorAuthenticationSchema,
      OtpChannelSchema,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    ...commands,
    ...queries,
    ...events,
    ...services,
    ...repositories,
    ...mappers,
    ...factories,
  ],
})
export class AuthModule {}
