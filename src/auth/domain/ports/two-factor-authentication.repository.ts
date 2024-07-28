import { RepositoryDelete } from '@common/infrastructure/database/entity.repository';
import { TwoFactorAuthenticationSchema } from '@common/infrastructure/database/typeorm/schemas/twoFactorAuthentication.schema';

export interface ITwoFactorAuthenticationRepository {
  delete: RepositoryDelete<TwoFactorAuthenticationSchema>;
}

export const ITwoFactorAuthenticationRepository = Symbol(
  'ITwoFactorAuthenticationRepository',
);
