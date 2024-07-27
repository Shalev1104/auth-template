import { Entity } from '@common/domain/entity';
import { EmailAddress } from '../value-objects/EmailAddress';
import { ILoginable } from '../User.aggregate';
import { Uuid } from '@common/domain/value-objects/Uuid';
import { OAuthProvider } from '@common/infrastructure/database/typeorm/enums/OAuthProvider.enum';
import { z } from 'zod';
import { AvatarImageUrl } from '../value-objects/UserProfile';

export const ProviderId = Uuid;
export type ProviderId = z.infer<typeof ProviderId>;

interface IOAuthLogin {
  providerName: OAuthProvider;
  providerId: ProviderId;
  data?: {
    emailAddress?: EmailAddress;
    avatarImageUrl?: EmailAddress;
  };
}

export class OAuthLogin
  extends Entity<OAuthProvider>
  implements IOAuthLogin, ILoginable
{
  protected readonly _providerId: ProviderId;
  protected readonly _emailAddress?: EmailAddress;
  protected readonly _avatarImageUrl?: AvatarImageUrl;

  constructor(externalLogin: IOAuthLogin) {
    super(externalLogin.providerName);
    this._providerId = externalLogin.providerId;
    this._emailAddress = externalLogin.data?.emailAddress;
    this._avatarImageUrl = externalLogin.data?.avatarImageUrl;
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
  get avatarImageUrl() {
    return this._avatarImageUrl;
  }
}

export class GoogleLogin extends OAuthLogin {
  constructor(
    providerId: ProviderId,
    emailAddress: EmailAddress,
    avatarImageUrl: AvatarImageUrl,
  ) {
    super({
      providerId,
      providerName: OAuthProvider.Google,
      data: {
        emailAddress,
        avatarImageUrl,
      },
    });
  }
}

export class GithubLogin extends OAuthLogin {
  constructor(
    providerId: ProviderId,
    emailAddress: EmailAddress,
    avatarImageUrl: AvatarImageUrl,
  ) {
    super({
      providerId,
      providerName: OAuthProvider.Github,
      data: {
        emailAddress,
        avatarImageUrl,
      },
    });
  }
}

export class FacebookLogin extends OAuthLogin {
  constructor(
    providerId: ProviderId,
    emailAddress: EmailAddress,
    avatarImageUrl: AvatarImageUrl,
  ) {
    super({
      providerId,
      providerName: OAuthProvider.Facebook,
      data: {
        emailAddress,
        avatarImageUrl,
      },
    });
  }
}
