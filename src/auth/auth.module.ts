import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginCommandHandler } from './application/commands/login.command';
import { RefreshAccessTokenCommandHandler } from './application/commands/refresh-access-token.command';
import { RegisterCommandHandler } from './application/commands/register.command';
import { UserCreatedEvent } from './application/events/user-created.event';
import { UserFactory } from './application/factories/user.factory';
import { GetUserClaimsQueryHandler } from './application/queries/get-user-claims.query';
import { AuthenticationService } from './application/services/auth.service';
import { EncryptionService } from './application/services/encryption.service';
import { UserRepository } from './infrastructure/database/user.db-repository';
import { UserMapper } from './infrastructure/database/user.mapper';
import { AuthController } from './infrastructure/http/auth.controller';
import { UserController } from './infrastructure/http/user.controller';
import { BearerTokenService } from './application/services/bearer-token.service';
import { ConnectWithGithubCommandHandler } from './application/commands/connect-github.command';
import { GithubService } from './application/services/github.service';
import { HttpModule } from '@nestjs/axios';

const commands = [
  LoginCommandHandler,
  RegisterCommandHandler,
  RefreshAccessTokenCommandHandler,
  ConnectWithGithubCommandHandler,
];
const queries = [GetUserClaimsQueryHandler];
const events = [UserCreatedEvent];
const services = [
  AuthenticationService,
  EncryptionService,
  BearerTokenService,
  GithubService,
];
const repositories = [UserRepository];
const mappers = [UserMapper];
const factories = [UserFactory];

@Module({
  imports: [CqrsModule, HttpModule],
  controllers: [AuthController, UserController],
  providers: [
    ...commands,
    ...queries,
    ...events,
    ...services,
    ...repositories,
    ...mappers,
    ...factories,
    JwtService,
  ],
})
export class AuthModule {}
