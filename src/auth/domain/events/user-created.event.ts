import { User } from '../User.aggregate';
import { LoginProvider } from '../value-objects/LoginProvider';

export class UserCreatedEvent {
  constructor(
    public readonly user: User,
    public readonly registeredWith: LoginProvider,
  ) {}
}
