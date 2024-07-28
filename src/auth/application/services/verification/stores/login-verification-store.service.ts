import { Inject, Injectable } from '@nestjs/common';
import {
  BaseVerificationCache,
  BaseVerificationCookie,
  BaseVerificationStore,
} from './verification-store.base.service';
import { IRedisRepository } from '@common/infrastructure/database/cache/iredis.repository';
import { UserId } from '@auth/domain/User.aggregate';
import { Cookies } from '@common/infrastructure/http/cookies';
import { EncryptedVerificationCode } from '@auth/domain/value-objects/VerificationCode';

export type LoginVerificationCache = BaseVerificationCache & {
  id: string;
  attempts: number;
};

export type LoginVerificationCookie = BaseVerificationCookie & {
  id: string;
  userId: string;
};

@Injectable()
export class LoginVerificationStore extends BaseVerificationStore<
  LoginVerificationCache,
  LoginVerificationCookie
> {
  protected readonly expirationInMinutes = 10;
  public readonly maxAttempts = 5;

  constructor(
    @Inject(IRedisRepository)
    protected readonly redisRepository: IRedisRepository,
  ) {
    super(redisRepository);
  }

  protected getCacheKey(userId: UserId) {
    return `${Cookies.Login2FA}:${userId}`;
  }
  protected getCookieKey() {
    return Cookies.Login2FA;
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
      attempts: 0,
    };
  }

  async incrementAttempts(userId: UserId) {
    const verificationStore = await this.getCache(userId);
    verificationStore.attempts++;
    const ttl = await this.redisRepository.ttl(this.getCacheKey(userId));

    await this.redisRepository.set(
      this.getCacheKey(userId),
      JSON.stringify(verificationStore),
      ttl,
    );

    return verificationStore;
  }
}
