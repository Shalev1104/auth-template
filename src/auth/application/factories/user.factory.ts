import {
  GithubLogin,
  GoogleLogin,
} from '@auth/domain/entities/OAuthLogin.entity';
import { Injectable } from '@nestjs/common';
import { validateSchema } from '@common/domain/entity-validate';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { ProviderNotExistException } from '@auth/domain/exceptions/provider-not-exist.exception';
import { EncryptionService } from '../services/encryption.service';
import { PlainPassword } from '@auth/domain/value-objects/Password';
import { User } from '@auth/domain/User.aggregate';
import { EmailAndPasswordLogin } from '@auth/domain/entities/EmailAndPasswordLogin.entity';
import { LoginProvider } from '@auth/domain/value-objects/LoginProvider';
import { UserCreatedEvent } from '@auth/domain/events/user-created.event';
import { UserAlreadyExistException } from '@auth/domain/exceptions/user-already-exist.exception';
import { GoogleUser } from '@auth/domain/strategies/google.strategy';
import { GithubUser } from '@auth/domain/strategies/github.strategy';
import { RegisterDto } from '@auth/infrastructure/http/dtos/register.dto';

@Injectable()
export class UserFactory {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createUser(provider: LoginProvider, data: unknown): Promise<User> {
    const existedUser = await this.getUserByProvider(provider, data);
    if (existedUser) throw new UserAlreadyExistException();

    const user = await this.constructMappedUser(provider, data);
    await this.userRepository.save(user);
    user.apply(new UserCreatedEvent(user, provider));
    return user;
  }

  private async getUserByProvider(
    provider: LoginProvider,
    data: unknown,
  ): Promise<User | undefined> {
    switch (provider) {
      case LoginProvider.EmailAndPassword:
        return this.userRepository.getUserByEmail(
          (<RegisterDto>data).emailAddress,
        );

      case LoginProvider.Google:
        return this.userRepository.getUserByGoogleId((<GoogleUser>data).id);

      case LoginProvider.Github:
        return this.userRepository.getUserByGithubId(
          (<GithubUser>data).id.toString(),
        );
    }
  }

  private async constructMappedUser(
    provider: LoginProvider,
    data: unknown,
  ): Promise<User> {
    switch (provider) {
      case LoginProvider.EmailAndPassword:
        return this.constructEmailAndPasswordUser(<RegisterDto>data);
      case LoginProvider.Google:
        return this.constructGoogleUser(<GoogleUser>data);
      case LoginProvider.Github:
        return this.constructGithubUser(<GithubUser>data);
      default:
        throw new ProviderNotExistException();
    }
  }

  private async constructEmailAndPasswordUser(
    register: RegisterDto,
  ): Promise<User> {
    const plainPassword = validateSchema(PlainPassword, register.password);
    const hashedPassword = await this.encryptionService.hashPlainPassword(
      plainPassword,
    );

    return new User({
      emailAndPasswordLogin: new EmailAndPasswordLogin({
        emailAddress: register.emailAddress,
        hashedPassword,
      }),
      phone: register.phone,
      userProfile: {
        name: register.name,
        avatarImageUrl: register.avatarImageUrl,
      },
    });
  }

  private async constructGoogleUser(user: GoogleUser): Promise<User> {
    return new User({
      oAuthLogins: [new GoogleLogin(user.id, user.email)],
      userProfile: {
        name: user.name,
        avatarImageUrl: user.picture,
      },
      phone: undefined,
    });
  }

  private async constructGithubUser(user: GithubUser): Promise<User> {
    return new User({
      oAuthLogins: [new GithubLogin(user.id.toString(), user.email)],
      userProfile: {
        name: user.name,
        avatarImageUrl: user.avatar_url,
      },
      phone: undefined,
    });
  }
}
