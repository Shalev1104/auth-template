import { User } from '@auth/domain/User.model';
import { UserAlreadyExistException } from '@auth/domain/exceptions/user-already-exist.exception';
import {
  AuthCredentials,
  LocalStrategy,
} from '@auth/domain/value-objects/AuthCredentials.vo';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { PlainPassword } from '@auth/domain/value-objects/PlainPassword.vo';
import { UserProfile } from '@auth/domain/value-objects/UserProfile.vo';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { EntityFactory } from '@common/database/entity.factory';
import { ValueObject } from '@common/ddd/value-object';
import { AuthStrategy } from '@common/infrastructure/http/user';
import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../services/encryption.service';
import {
  SocialUserRequestDto,
  UserRequestDto,
} from '@auth/infrastructure/http/dtos/user.dto';

type UserDto<T> = T extends LocalStrategy
  ? UserRequestDto
  : SocialUserRequestDto;

@Injectable()
export class UserFactory<T extends AuthStrategy>
  implements EntityFactory<User<T>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(userDto: UserDto<T>): Promise<User<T>> {
    const { emailAddress } = userDto;

    const validatedEmail = ValueObject.createValueObjectOrFail(
      Email,
      emailAddress,
    );

    const existedUser = await this.userRepository.getUserByEmail(emailAddress);
    if (existedUser) throw new UserAlreadyExistException();

    const user = await this.createNewUserByStrategy(userDto, validatedEmail);

    await this.userRepository.save(user);
    user.onCreatedUser();

    return user;
  }

  private async createNewUserByStrategy(
    userDto: UserDto<T>,
    validatedEmail: Email,
  ): Promise<User<T>> {
    const profile = new UserProfile({
      name: userDto.name,
      avatarImageUrl: userDto.avatarImageUrl,
    });

    if (userDto instanceof SocialUserRequestDto) {
      const socialUserCredentials = new AuthCredentials({
        authStrategy: userDto.strategy,
        email: validatedEmail,
      });
      return new User(socialUserCredentials, profile);
    }

    const validatedPassword = ValueObject.createValueObjectOrFail(
      PlainPassword,
      userDto.password,
    );
    const hashedPassword = await this.encryptionService.hashPlainPassword(
      validatedPassword.password,
    );
    const localUserCredentials = new AuthCredentials({
      authStrategy: AuthStrategy.Local,
      email: validatedEmail,
      hashedPassword: hashedPassword,
    });

    return new User(localUserCredentials, profile);
  }
}
