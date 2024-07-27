import { User } from '../User.aggregate';

export class AttemptedLoginEvent {
  constructor(
    public readonly user: User,
    public readonly isSuccess: boolean,
    public readonly ipAddress: string,
  ) {}
}
