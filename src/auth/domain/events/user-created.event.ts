import { UserId } from '../User.aggregate';

export class UserCreatedEvent {
  constructor(public readonly userId: UserId) {}
}
