import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../http/dtos/user.dto';
import { User } from '@auth/domain/User.model';
import {
  nullToUndefinedOrValue,
  undefinedToNullOrValue,
} from '@common/infrastructure/http/casts';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import {
  AuthCredentials,
  AuthStrategy,
} from '@auth/domain/value-objects/AuthCredentials.vo';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { HashedPassword } from '@auth/domain/value-objects/HashedPassword.vo';
import { UserProfile } from '@auth/domain/value-objects/UserProfile.vo';

export interface UserEntity extends UserSchema {
  localCredentials: {
    password: string;
  } | null;
}

@Injectable()
export class UserMapper {
  toDomain = (entity: UserSchema) => {
    let credentials: AuthCredentials<AuthStrategy> = new AuthCredentials(
      {} as any,
    );

    if (entity.emailAndPasswordLogin) {
      credentials = new AuthCredentials({
        authStrategy: AuthStrategy.Local,
        email: new Email(entity.emailAndPasswordLogin.emailAddress),
        hashedPassword: new HashedPassword(
          entity.emailAndPasswordLogin.hashedPassword,
        ),
      });
    }
    return new User(
      credentials,
      new UserProfile({
        name: entity.name,
        avatarImageUrl: nullToUndefinedOrValue(entity.avatarImageUrl),
      }),
      entity.userId,
    );
  };

  toPersistence = (user: User): UserSchema => ({
    userId: user.userId.toString(),
    name: user.userProfile.name,
    avatarImageUrl: undefinedToNullOrValue(user.userProfile.avatarImageUrl),
    createdAt: new Date(),
    lastLoginAt: user.lastLoginAt,
    oAuthLogins: [],
    phone: null,
  });

  toResponseDTO = (user: User): UserResponseDto => ({
    userId: user.userId.toString(),
    emailAddress: user.email.toString(),
    lastLoginAt: user.lastLoginAt,
    strategy: user.authStrategy as any,
    userProfile: user.userProfile,
  });
}
