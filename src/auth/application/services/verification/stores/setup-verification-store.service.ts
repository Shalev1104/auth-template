import { UserId } from '@auth/domain/User.aggregate';
import { EncryptedVerificationCode } from '@auth/domain/value-objects/VerificationCode';
import { Cookies } from '@common/infrastructure/http/cookies';
import { Injectable } from '@nestjs/common';
import {
  BaseVerificationCache,
  BaseVerificationCookie,
  BaseVerificationStore,
} from './verification-store.base.service';

export type SetupVerificationCache = BaseVerificationCache & {
  recoveryCodes: string[];
};

export type SetupVerificationCookie = BaseVerificationCookie & {
  setAsDefault2fa: boolean;
};

@Injectable()
export class SetupVerificationStore extends BaseVerificationStore<
  SetupVerificationCache,
  SetupVerificationCookie
> {
  protected readonly expirationInMinutes = 60;

  protected getCacheKey(userId: UserId) {
    return `${Cookies.Setup2FA}:${userId}`;
  }
  protected getCookieKey() {
    return Cookies.Setup2FA;
  }

  constructCache(
    id: string,
    channelId: number,
    encryptedVerificationCode: EncryptedVerificationCode | null = null,
  ) {
    return {
      id,
      channelId,
      otp: encryptedVerificationCode,
      recoveryCodes: [],
    };
  }
}
