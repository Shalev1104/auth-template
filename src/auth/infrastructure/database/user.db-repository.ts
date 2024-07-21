import {
  IUserRepository,
  GetUserById,
  GetUserByEmail,
  SaveUser,
} from '@auth/domain/repositories/User.repository';
import { PostgresRepository } from '@common/database/entity.repository';
import { Injectable } from '@nestjs/common';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository
  extends PostgresRepository
  implements IUserRepository
{
  constructor(private userMapper: UserMapper) {
    super();
  }

  getUserById: GetUserById = async (userId) => {
    const entity = await this.prisma.user.findFirst({
      where: {
        userId,
      },
      include: {
        localCredentials: true,
      },
    });

    if (!entity) return undefined;

    return this.userMapper.toDomain(entity);
  };

  getUserByEmail: GetUserByEmail = async (emailAddress) => {
    const entity = await this.prisma.user.findFirst({
      where: {
        emailAddress,
      },
      include: {
        localCredentials: true,
      },
    });

    if (!entity) return undefined;

    return this.userMapper.toDomain(entity);
  };

  save: SaveUser = async (user) => {
    const entity = this.userMapper.toPersistence(user);
    const { userId, localCredentials, ...rest } = entity;
    const newUser = await this.prisma.user.upsert({
      where: { userId: entity.userId },
      include: {
        localCredentials: true,
      },
      create: {
        userId,
        ...rest,
        ...(localCredentials && {
          localCredentials: {
            create: { password: localCredentials.password },
          },
        }),
      },
      update: {
        ...rest,
        ...(localCredentials && {
          localCredentials: {
            update: { password: localCredentials.password },
          },
        }),
      },
    });

    return this.userMapper.toDomain(newUser);
  };
}
