import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { User } from '../User.aggregate';

export class AddedSocialLoginEvent {
  constructor(
    public readonly user: User,
    public readonly socialLogin: OAuthProvider,
  ) {}
}
