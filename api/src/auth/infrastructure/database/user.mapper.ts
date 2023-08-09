import { User } from '@auth/domain/User.model';
import { User as SemiUserEntity } from '@prisma/postgres/client';
import { EntityMapper } from '@common/database/entity.mapper';
import { AuthCredentials } from '@auth/domain/value-objects/AuthCredentials.vo';
import { Email } from '@auth/domain/value-objects/Email.vo';
import { HashedPassword } from '@auth/domain/value-objects/HashedPassword.vo';
import { UserProfile } from '@auth/domain/value-objects/UserProfile.vo';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../http/dtos/user.dto';

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
    return new User(
      new AuthCredentials({
        authStrategy: entity.authStrategy as any,
        email: new Email(entity.emailAddress),
        ...(entity.localCredentials && {
          hashedPassword: new HashedPassword(entity.localCredentials.password),
        }),
      }),
      new UserProfile({
        firstName: entity.firstName,
        lastName: entity.lastName,
      }),
      entity.userId,
    );
  }

  toPersistence(user: User): UserEntity {
    return {
      userId: user.userId.toString(),
      authStrategy: user.authStrategy,
      avatarImageUrl: null,
      firstName: user.userProfile.firstName,
      lastName: user.userProfile.lastName,
      emailAddress: user.email.address,
      localCredentials: { password: user.hashedPassword.password },
    };
  }

  toResponseDTO(domain: User): UserResponseDto {
    return {
      emailAddress: domain.email.address,
      lastLoginAt: domain.lastLoginAt,
      userId: domain.userId.toString(),
      userProfile: {
        displayName: domain.userProfile.displayName,
        firstName: domain.userProfile.firstName,
        lastName: domain.userProfile.lastName,
      },
    };
  }
}
