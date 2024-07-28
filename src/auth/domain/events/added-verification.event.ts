import { EmailAndPasswordLogin } from '../entities/EmailAndPasswordLogin.entity';
import { Verification } from '../entities/Verification.entity';
import { UserWithEmailAndPasswordLogin } from '../User.aggregate';

export class AddedVerificationEvent {
  constructor(
    public readonly user: UserWithEmailAndPasswordLogin,
    public readonly verification: Verification,
  ) {}
}
