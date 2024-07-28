import { User } from '../User.aggregate';

export class Enabled2FAEvent {
  constructor(public readonly user: User) {}
}
