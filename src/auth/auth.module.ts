import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginCommandHandler } from './application/commands/identification/login.command';
import { RefreshAccessTokenCommandHandler } from './application/commands/authentication/refresh-access-token.command';
import { RegisterCommandHandler } from './application/commands/identification/register.command';
import { UserFactory } from './application/factories/user.factory';
import { GetAuthenticatedUserQueryHandler } from './application/queries/get-authenticated-user.query';
import { AuthenticationService } from './application/services/authentication.service';
import { HashingService } from './application/services/hashing.service';
import { UserRepository } from './infrastructure/database/user.db-repository';
import { UserMapper } from './infrastructure/database/user.mapper';
import { AuthController } from './infrastructure/http/controllers/auth/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '@common/infrastructure/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { OAuthLoginSchema } from '@common/infrastructure/database/typeorm/schemas/oAuthLogin.schema';
import { UserCreatedEventHandler } from './application/events/user-created.event';
import { VerificationSchema } from '@common/infrastructure/database/typeorm/schemas/verifications.schema';
import { TwoFactorAuthenticationSchema } from '@common/infrastructure/database/typeorm/schemas/twoFactorAuthentication.schema';
import { OtpChannelSchema } from '@common/infrastructure/database/typeorm/schemas/otpChannel.schema';
import { CommunicationsModule } from '@common/infrastructure/communications/communications.module';
import { AuthMailService } from './infrastructure/mail/auth-mail.service';
import { ConfigModule } from '@nestjs/config';
import { ConnectWithOAuthCommandHandler } from './application/commands/authorization/connect-oauth.command';
import { AddedSocialLoginEventHandler } from './application/events/added-social-login.event';
import { AttemptedLoginEventHandler } from './application/events/attempted-login.event';
import { GoogleService } from './infrastructure/oauth/google/google.service';
import { GithubService } from './infrastructure/oauth/github/github.service';
import { FacebookService } from './infrastructure/oauth/facebook/facebook.service';
import { OAuthController } from './infrastructure/http/controllers/oauth/oauth.controller';
import { UnlinkOAuthCommandHandler } from './application/commands/authorization/unlink-oauth.command';
import { RemovedSocialLoginEventHandler } from './application/events/removed-social-login.event';
import { IUserRepository } from './domain/ports/user.repository';
import { SetupVerificationCommandHandler } from './application/commands/verification/setup-verification.command';
import { SendVerificationCodeCommandHandler } from './application/commands/verification/send-verification-code.command';
import { ResendVerificationCodeCommandHandler } from './application/commands/verification/resend-verification-code.command';
import { InitiatedVerificationEventHandler } from './application/events/initiated-verification.event';
import { CacheVerificationEventHandler } from './application/events/cache-verification.event';
import { VerificationSaga } from './application/sagas/verification.saga';
import { EncryptionService } from './application/services/encryption.service';
import { SetupVerificationStore } from './application/services/verification/stores/setup-verification-store.service';
import { LoginVerificationStore } from './application/services/verification/stores/login-verification-store.service';
import { OtpService } from './application/services/verification/otp.service';
import { TotpService } from './application/services/verification/totp.service';
import {
  AuthenticatorVerificator,
  EmailVerificator,
  OtpVerificator,
  PhoneCallVerificator,
  SmsVerificator,
} from './application/services/verification/verificator.service';

const commands = [
  LoginCommandHandler,
  RegisterCommandHandler,
  RefreshAccessTokenCommandHandler,

  ConnectWithOAuthCommandHandler,
  UnlinkOAuthCommandHandler,

  SetupVerificationCommandHandler,
  SendVerificationCodeCommandHandler,
  ResendVerificationCodeCommandHandler,
];
const queries = [GetAuthenticatedUserQueryHandler];
const events = [
  UserCreatedEventHandler,
  AttemptedLoginEventHandler,
  AddedSocialLoginEventHandler,
  RemovedSocialLoginEventHandler,
  InitiatedVerificationEventHandler,
  CacheVerificationEventHandler,
];
const sagas = [VerificationSaga];
const services = [
  JwtService,
  AuthenticationService,
  HashingService,
  EncryptionService,
  GoogleService,
  GithubService,
  FacebookService,
  AuthMailService,
  LoginVerificationStore,
  SetupVerificationStore,
  OtpService,
  TotpService,
  OtpVerificator,
  AuthenticatorVerificator,
  EmailVerificator,
  SmsVerificator,
  PhoneCallVerificator,
];
const repositories = [
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
];
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
  controllers: [AuthController, OAuthController],
  providers: [
    ...commands,
    ...queries,
    ...events,
    ...sagas,
    ...services,
    ...repositories,
    ...mappers,
    ...factories,
  ],
})
export class AuthModule {}
