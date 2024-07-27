import {
  GithubLogin,
  GoogleLogin,
} from '@auth/domain/entities/OAuthLogin.entity';
import { Injectable } from '@nestjs/common';
import { validateSchema } from '@common/domain/entity-validate';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { EncryptionService } from '../services/encryption.service';
import { PlainPassword } from '@auth/domain/value-objects/Password';
import { User } from '@auth/domain/User.aggregate';
import { EmailAndPasswordLogin } from '@auth/domain/entities/EmailAndPasswordLogin.entity';
import { LoginProvider } from '@auth/domain/value-objects/LoginProvider';
import { UserCreatedEvent } from '@auth/domain/events/user-created.event';
import { UserAlreadyExistException } from '@auth/domain/exceptions/user-already-exist.exception';
import { IGoogleAuthorization } from '@auth/infrastructure/oauth/google/google.authorization';
import { IGithubAuthorization } from '@auth/infrastructure/oauth/github/github.authorization';
import { RegisterDto } from '@auth/infrastructure/http/controllers/auth/auth.dto';
import { ProviderNotExistException } from '@auth/domain/exceptions/oauth/provider-not-exist.exception';

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
        return this.userRepository.getUserByGoogleId(
          (<IGoogleAuthorization>data).id,
        );

      case LoginProvider.Github:
        return this.userRepository.getUserByGithubId(
          (<IGithubAuthorization>data).id.toString(),
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
        return this.constructGoogleUser(<IGoogleAuthorization>data);
      case LoginProvider.Github:
        return this.constructGithubUser(<IGithubAuthorization>data);
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

  private async constructGoogleUser(
    authorization: IGoogleAuthorization,
  ): Promise<User> {
    return new User({
      oAuthLogins: [
        new GoogleLogin(
          authorization.id,
          authorization.email,
          authorization.picture,
        ),
      ],
      userProfile: {
        name: authorization.name,
        avatarImageUrl: authorization.picture,
      },
      phone: undefined,
    });
  }

  private async constructGithubUser(
    authorization: IGithubAuthorization,
  ): Promise<User> {
    return new User({
      oAuthLogins: [
        new GithubLogin(
          authorization.id.toString(),
          authorization.email,
          authorization.avatar_url,
        ),
      ],
      userProfile: {
        name: authorization.name,
        avatarImageUrl: authorization.avatar_url,
      },
      phone: undefined,
    });
  }
}
