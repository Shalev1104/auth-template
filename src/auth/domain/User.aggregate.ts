import { AggregateRoot } from '@nestjs/cqrs';
import { EntityCollection } from '@common/domain/entity-collection';
import { validateSchema } from '@common/domain/entity-validate';
import { WithRequired } from '@common/types/with-required';
import { Name, AvatarImageUrl, UserProfile } from './value-objects/UserProfile';
import { OAuthLogin } from './entities/OAuthLogin.entity';
import { Uuid, generateUuidOrValue } from '@common/domain/value-objects/Uuid';
import { EmailAndPasswordLogin } from './entities/EmailAndPasswordLogin.entity';
import { Phone } from './value-objects/Phone';
import { LoginAccount, LoginProvider } from './value-objects/LoginProvider';
import { EmailAddress } from './value-objects/EmailAddress';
import { z } from 'zod';
import { ProviderNotExistException } from './exceptions/provider-not-exist.exception';

export const UserId = Uuid;
export type UserId = z.infer<typeof UserId>;

interface IUser {
  userId?: UserId;
  emailAndPasswordLogin?: EmailAndPasswordLogin;
  userProfile: UserProfile;
  phone: Phone;
  oAuthLogins?: OAuthLogin[];
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface ILoginable {
  providerName: LoginProvider;
}

export type UserWithEmailAndPasswordLogin = WithRequired<
  User,
  'emailAndPasswordLogin'
>;

export class User extends AggregateRoot {
  private readonly _userId: UserId;
  private readonly _userProfile: UserProfile;
  private readonly _emailAndPasswordLogin?: EmailAndPasswordLogin;
  private readonly _oAuthLogin: EntityCollection<OAuthLogin>;
  private _phone: Phone;
  private _lastLoginAt: Date;
  private readonly _createdAt: Date;

  constructor(user: IUser) {
    super();
    this._userId = generateUuidOrValue(user.userId);
    this._phone = validateSchema(Phone, user.phone);
    this._userProfile = validateSchema(UserProfile, user.userProfile);
    this._emailAndPasswordLogin = user.emailAndPasswordLogin;
    this._oAuthLogin = new EntityCollection(user.oAuthLogins);
    this._createdAt = user.createdAt || new Date();
    this._lastLoginAt = user.lastLoginAt || new Date();
  }

  updateLastLogin() {
    this._lastLoginAt = new Date();
  }

  getUserProfile(): UserProfile {
    return this._userProfile;
  }

  getLoginAccounts(): LoginAccount[] {
    const providers: LoginAccount[] = [];
    if (this.isEmailAndPasswordUser())
      providers.push({
        loginProvider: this.emailAndPasswordLogin.providerName,
        emailAddress: this.emailAndPasswordLogin.emailAddress,
      });

    providers.push(
      ...Array.from(this._oAuthLogin).map((f) => ({
        loginProvider: f.providerName,
        emailAddress: f.emailAddress,
      })),
    );
    return providers;
  }

  getLoginAccountEmail(loginProvider: LoginProvider): EmailAddress | undefined {
    const loginAccounts = this.getLoginAccounts();
    const selectedProvider = loginAccounts.find(
      (f) => f.loginProvider === loginProvider,
    );
    if (!selectedProvider) throw new ProviderNotExistException();
    return selectedProvider.emailAddress;
  }

  isEmailAndPasswordUser = (): this is UserWithEmailAndPasswordLogin =>
    this._emailAndPasswordLogin instanceof EmailAndPasswordLogin;

  changePhoneNumber(phone: Phone) {
    this._phone = phone;
  }

  get userId(): UserId {
    return this._userId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get name(): Name {
    return this._userProfile.name;
  }
  get avatarImageUrl(): AvatarImageUrl {
    return this._userProfile.avatarImageUrl;
  }
  get phone(): Phone {
    return this._phone;
  }
  get lastLoginAt(): Date {
    return this._lastLoginAt;
  }
  get emailAndPasswordLogin(): EmailAndPasswordLogin | undefined {
    return this._emailAndPasswordLogin;
  }
  get oAuthLogin(): EntityCollection<OAuthLogin> {
    return this._oAuthLogin;
  }
}
