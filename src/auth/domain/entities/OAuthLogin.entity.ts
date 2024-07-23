import { Entity } from '@common/domain/entity';
import { EmailAddress } from '../value-objects/EmailAddress';
import { ILoginable } from '../User.aggregate';
import { Uuid } from '@common/domain/value-objects/Uuid';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { z } from 'zod';

export const ProviderId = Uuid;
export type ProviderId = z.infer<typeof ProviderId>;

interface IOAuthLogin {
  providerName: OAuthProvider;
  providerId: ProviderId;
  emailAddress?: EmailAddress;
}

export class OAuthLogin
  extends Entity<OAuthProvider>
  implements IOAuthLogin, ILoginable
{
  protected readonly _providerId: ProviderId;
  protected readonly _emailAddress?: EmailAddress;

  constructor(externalLogin: IOAuthLogin) {
    super(externalLogin.providerName);
    this._emailAddress = externalLogin.emailAddress;
    this._providerId = externalLogin.providerId;
  }

  get providerId() {
    return this._providerId;
  }

  get providerName() {
    return this.entityId;
  }
  get emailAddress() {
    return this._emailAddress;
  }
}

export class GoogleLogin extends OAuthLogin {
  constructor(providerId: ProviderId, emailAddress: EmailAddress) {
    super({
      providerId,
      emailAddress,
      providerName: OAuthProvider.Google,
    });
  }
}

export class GithubLogin extends OAuthLogin {
  constructor(providerId: ProviderId, emailAddress: EmailAddress) {
    super({
      providerId,
      emailAddress,
      providerName: OAuthProvider.Github,
    });
  }
}

export class FacebookLogin extends OAuthLogin {
  constructor(providerId: ProviderId, emailAddress: EmailAddress) {
    super({
      providerId,
      emailAddress,
      providerName: OAuthProvider.Facebook,
    });
  }
}
