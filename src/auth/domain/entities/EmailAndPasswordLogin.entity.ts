import { EntityCollection } from '@common/domain/entity-collection';
import { WithRequired } from '@common/types/with-required';
import { HashedPassword } from '../value-objects/Password';
import { SharedSecret } from '../value-objects/SharedSecret';
import { Verification, VerificationId } from './Verification.entity';
import { Entity } from '@common/domain/entity';
import { EmailAddress } from '../value-objects/EmailAddress';
import { ILoginable } from '../User.aggregate';
import { TwoFactorAuthentication } from './TwoFactorAuthentication.entity';
import { LoginProvider } from '../value-objects/LoginProvider';
import { Uuid } from '@common/domain/value-objects/Uuid';
import { z } from 'zod';

export const LoginId = Uuid;
export type LoginId = z.infer<typeof LoginId>;

interface IEmailAndPasswordLogin {
  loginId?: LoginId;
  emailAddress: EmailAddress;
  hashedPassword: HashedPassword;
  sharedSecret?: SharedSecret;
  twoFactorAuthentication?: TwoFactorAuthentication;
  verifications?: Verification[];
}

export type EmailAndPasswordLoginWithTwoFactorAuthentication = WithRequired<
  EmailAndPasswordLogin,
  'twoFactorAuthentication'
>;

export class EmailAndPasswordLogin
  extends Entity<LoginId>
  implements ILoginable
{
  private readonly _emailAddress: EmailAddress;
  private readonly _hashedPassword: HashedPassword;
  private readonly _verifications: EntityCollection<Verification>;
  readonly providerName = LoginProvider.EmailAndPassword;
  private _sharedSecret?: SharedSecret;
  private _twoFactorAuthentication?: TwoFactorAuthentication;

  constructor(internalLogin: IEmailAndPasswordLogin) {
    super(internalLogin.loginId);
    this._emailAddress = internalLogin.emailAddress;
    this._hashedPassword = internalLogin.hashedPassword;
    this._sharedSecret = internalLogin.sharedSecret;
    this._verifications = new EntityCollection(internalLogin.verifications);
    this._twoFactorAuthentication = internalLogin.twoFactorAuthentication;
  }

  addSharedSecret(sharedSecret: SharedSecret) {
    this._sharedSecret = sharedSecret;
  }

  removeSharedSecret() {
    this._sharedSecret = undefined;
  }

  isEnabled2FA(
    verificationId?: VerificationId,
  ): this is EmailAndPasswordLoginWithTwoFactorAuthentication {
    if (!verificationId) return !!this._twoFactorAuthentication;
    return !!this.twoFactorAuthentication?.equals(verificationId);
  }

  enable2FA(verification: Verification) {
    this._twoFactorAuthentication = new TwoFactorAuthentication(verification);
  }

  get loginId() {
    return this.entityId;
  }
  get emailAddress() {
    return this._emailAddress;
  }
  get hashedPassword() {
    return this._hashedPassword;
  }
  get sharedSecret() {
    return this._sharedSecret;
  }
  get twoFactorAuthentication() {
    return this._twoFactorAuthentication;
  }
  get verifications() {
    return this._verifications;
  }
}
