import {
  RepositoryGet,
  RepositorySave,
} from '@common/infrastructure/database/entity.repository';
import { User, UserWithEmailAndPasswordLogin } from '../User.aggregate';
import { ProviderId } from '../entities/OAuthLogin.entity';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';

export interface IUserRepository {
  getUserById: RepositoryGet<User>;
  getUserByEmail: RepositoryGet<UserWithEmailAndPasswordLogin>;

  getUserByOAuthId: (
    providerId: ProviderId,
    providerName: OAuthProvider,
  ) => Promise<User | undefined>;
  getUserByFacebookId: RepositoryGet<User>;
  getUserByGithubId: RepositoryGet<User>;
  getUserByGoogleId: RepositoryGet<User>;

  save: RepositorySave<User>;
}

export const IUserRepository = Symbol('IUserRepository');
