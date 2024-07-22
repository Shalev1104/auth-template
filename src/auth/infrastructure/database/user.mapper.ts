import { User } from '@auth/domain/User.model';
import { User as SemiUserEntity } from '@prisma/postgres/client';
import { EntityMapper } from '@common/infrastructure/database/entity.mapper';
import {
  nullToUndefinedOrValue,
  undefinedToNullOrValue,
} from '@common/infrastructure/http/casts';
import { AuthCredentials } from '@auth/domain/value-objects/AuthCredentials.vo';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { HashedPassword } from '@auth/domain/value-objects/HashedPassword.vo';
import { UserProfile } from '@auth/domain/value-objects/UserProfile.vo';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../http/dtos/user.dto';
import { AuthStrategy } from '@common/infrastructure/http/user';
import { MissingPasswordException } from '@auth/domain/exceptions/missing-password.exception';

export interface UserEntity extends SemiUserEntity {
  localCredentials: {
    password: string;
  } | null;
}

@Injectable()
export class UserMapper
  implements EntityMapper<User, UserEntity, UserResponseDto>
{
  toDomain(entity: UserEntity): User {
    let credentials: AuthCredentials<AuthStrategy>;
    if (entity.authStrategy === 'Local') {
      if (!entity.localCredentials) throw new MissingPasswordException();

      credentials = new AuthCredentials({
        authStrategy: entity.authStrategy,
        email: new Email(entity.emailAddress),
        hashedPassword: new HashedPassword(entity.localCredentials.password),
      });
    } else {
      credentials = new AuthCredentials({
        authStrategy: entity.authStrategy,
        email: new Email(entity.emailAddress),
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
  }

  toPersistence(user: User): UserEntity {
    return {
      userId: user.userId.toString(),
      authStrategy: user.authStrategy,
      avatarImageUrl: undefinedToNullOrValue(user.userProfile.avatarImageUrl),
      name: user.userProfile.name,
      emailAddress: user.email.address,
      localCredentials: { password: user.hashedPassword.password },
    };
  }

  toResponseDTO(domain: User): UserResponseDto {
    return {
      emailAddress: domain.email.address,
      lastLoginAt: domain.lastLoginAt,
      strategy: domain.authStrategy,
      userId: domain.userId.toString(),
      userProfile: {
        name: domain.userProfile.name,
        avatarImageUrl: domain.userProfile.avatarImageUrl,
      },
    };
  }
}
