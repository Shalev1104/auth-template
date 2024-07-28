import { User } from '../User.aggregate';

export class Disabled2FAEvent {
  constructor(public readonly user: User) {}
}
