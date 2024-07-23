import { IUserRepository } from '@auth/domain/ports/User.repository';
import { Injectable } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { Repository } from 'typeorm';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { ProviderId } from '@auth/domain/entities/OAuthLogin.entity';
import { UserWithEmailAndPasswordLogin } from '@auth/domain/User.aggregate';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userDbContext: Repository<UserSchema>,
    private userMapper: UserMapper,
  ) {}

  getUserById: IUserRepository['getUserById'] = async (userId) => {
    const entity = await this.userDbContext.findOne({
      where: {
        userId,
      },
    });
    if (!entity) return undefined;

    return this.userMapper.toDomain(entity);
  };

  getUserByEmail: IUserRepository['getUserByEmail'] = async (emailAddress) => {
    const entity = await this.userDbContext.findOne({
      where: {
        emailAndPasswordLogin: {
          emailAddress,
        },
      },
    });
    if (!entity) return undefined;

    return this.userMapper.toDomain(entity) as UserWithEmailAndPasswordLogin;
  };

  getUserByOAuthId = async (
    providerId: string,
    providerName: OAuthProvider,
  ) => {
    const entity = await this.userDbContext.findOne({
      where: {
        oAuthLogins: {
          providerId,
          providerName,
        },
      },
      loadRelationIds: { relations: ['oAuthLogins'] },
    });
    if (!entity) return undefined;

    return this.userMapper.toDomain(entity);
  };
  getUserByGoogleId = async (providerId: ProviderId) =>
    this.getUserByOAuthId(providerId, OAuthProvider.Google);
  getUserByGithubId = async (providerId: ProviderId) =>
    this.getUserByOAuthId(providerId, OAuthProvider.Github);
  getUserByFacebookId = async (providerId: ProviderId) =>
    this.getUserByOAuthId(providerId, OAuthProvider.Facebook);

  save: IUserRepository['save'] = async (user) => {
    const entity = await this.userDbContext.save(
      this.userMapper.toPersistence(user),
    );
    return this.userMapper.toDomain(entity);
  };
}
