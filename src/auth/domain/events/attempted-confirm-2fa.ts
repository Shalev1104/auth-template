import { User } from '../User.aggregate';

export class AttemptedConfirm2FAEvent {
  constructor(
    public readonly user: User,
    public readonly isSuccess: boolean,
    public readonly ipAddress: string,
  ) {}
}
