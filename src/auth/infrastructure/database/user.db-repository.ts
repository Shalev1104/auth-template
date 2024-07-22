import {
  IUserRepository,
  GetUserById,
  GetUserByEmail,
  SaveUser,
} from '@auth/domain/repositories/User.repository';
import { Injectable } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userDbContext: Repository<UserSchema>,
    private userMapper: UserMapper,
  ) {}

  getUserById: GetUserById = async (userId) => {
    const entity = await this.userDbContext.findOne({
      where: {
        userId,
      },
    });
    if (!entity) return undefined;

    return this.userMapper.toDomain(entity);
  };

  getUserByEmail: GetUserByEmail = async (emailAddress) => {
    const entity = await this.userDbContext.findOne({
      where: {
        emailAndPasswordLogin: {
          emailAddress,
        },
      },
    });
    if (!entity) return undefined;

    return this.userMapper.toDomain(entity);
  };

  save: SaveUser = async (user) => {
    const entity = await this.userDbContext.save(
      this.userMapper.toPersistence(user),
    );
    return this.userMapper.toDomain(entity);
  };
}
