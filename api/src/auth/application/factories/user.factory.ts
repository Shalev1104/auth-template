import { User } from '@auth/domain/User.model';
import { UserAlreadyExistException } from '@auth/domain/exceptions/user-already-exist.exception';
import { AuthCredentials } from '@auth/domain/value-objects/AuthCredentials.vo';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { PlainPassword } from '@auth/domain/value-objects/PlainPassword.vo';
import { UserProfile } from '@auth/domain/value-objects/UserProfile.vo';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { UserRequestDto } from '@auth/infrastructure/http/dtos/user.dto';
import { EntityFactory } from '@common/database/entity.factory';
import { ValueObject } from '@common/ddd/value-object';
import { AuthStrategy } from '@common/http/user';
import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class UserFactory implements EntityFactory<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(userProps: UserRequestDto): Promise<User> {
    const { emailAddress, password, firstName, lastName } = userProps;
    const validatedEmail = ValueObject.createValueObjectOrFail(
      Email,
      emailAddress,
    );
    const validatedPassword = ValueObject.createValueObjectOrFail(
      PlainPassword,
      password,
    );

    const existedUser = await this.userRepository.getUserByEmail(emailAddress);
    if (existedUser) throw new UserAlreadyExistException();

    const hashedPw = await this.encryptionService.hashPlainPassword(
      validatedPassword.password,
    );

    const user: User<AuthStrategy.Local> = new User(
      new AuthCredentials({
        authStrategy: AuthStrategy.Local,
        email: validatedEmail,
        hashedPassword: hashedPw,
      }),
      new UserProfile({
        firstName,
        lastName,
      }),
    );

    await this.userRepository.save(user);
    user.onCreatedUser();

    return user;
  }
}
