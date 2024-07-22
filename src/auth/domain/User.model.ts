import { UserCreatedEvent } from '@auth/application/events/user-created.event';
import { Uuid } from '@common/domain/uuid';
import { AuthStrategy, UserId } from '@common/infrastructure/http/user';
import { AggregateRoot } from '@nestjs/cqrs';
import { AuthCredentials } from './value-objects/AuthCredentials.vo';
import { UserProfile } from './value-objects/UserProfile.vo';

export class User<
  LoginPlan extends AuthStrategy = AuthStrategy,
> extends AggregateRoot {
  private readonly _userId: UserId;
  private _lastLoginAt: Date;

  constructor(
    private readonly _credentials: AuthCredentials<LoginPlan>,
    private readonly _userProfile: UserProfile,
    userId?: string,
  ) {
    super();
    this._userId = new Uuid(userId);
  }

  onCreatedUser() {
    this.apply(new UserCreatedEvent(this.userId));
    this.updateLastLogin();
  }

  updateLastLogin() {
    this._lastLoginAt = new Date();
  }

  get userId() {
    return this._userId;
  }

  get email() {
    return this._credentials.email;
  }

  get hashedPassword() {
    return this._credentials.hashedPassword;
  }

  get authStrategy() {
    return this._credentials.strategy;
  }

  get userProfile() {
    return this._userProfile;
  }

  get lastLoginAt() {
    return this._lastLoginAt;
  }
}
