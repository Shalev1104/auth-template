import { VerificationCodeNotFoundException } from '@auth/domain/exceptions/2fa/verification-code-not-found.exception';
import { UserId } from '@auth/domain/User.aggregate';
import { EncryptedVerificationCode } from '@auth/domain/value-objects/VerificationCode';
import { IRedisRepository } from '@common/infrastructure/database/cache/iredis.repository';
import { authCookieOptions } from '@common/infrastructure/http/cookies';
import { Inject } from '@nestjs/common';
import { Response } from 'express';

export type BaseVerificationCache = {
  id: string;
  channelId: number;
  otp: EncryptedVerificationCode | null;
};

export type BaseVerificationCookie = {
  id: string;
  channelId: number;
};

export interface IVerificationStore {
  getCache(userId: UserId): Promise<BaseVerificationCache>;
  createCache(
    id: string,
    userId: UserId,
    channelId: number,
    encryptedVerificationCode?: EncryptedVerificationCode,
  ): Promise<BaseVerificationCache>;
  deleteCache(userId: UserId): Promise<void>;
  changeCachedVerificationCode(
    userId: UserId,
    encryptedVerificationCode?: EncryptedVerificationCode,
  ): Promise<void>;

  getCookie(cookies: Record<string, unknown>): BaseVerificationCookie;
  setCookie(response: Response, data: BaseVerificationCookie): void;
  clearCookie(response: Response): void;
}

export abstract class BaseVerificationStore<
  TCache extends BaseVerificationCache,
  TCookie extends BaseVerificationCookie,
> implements IVerificationStore
{
  protected abstract readonly expirationInMinutes: number;

  constructor(
    @Inject(IRedisRepository)
    protected readonly redisRepository: IRedisRepository,
  ) {}

  protected abstract getCacheKey(userId: UserId): string;
  protected abstract getCookieKey(): string;
  protected abstract constructCache(
    id: string,
    channelId: number,
    encryptedVerificationCode?: EncryptedVerificationCode,
  ): TCache;

  async getCache(userId: UserId): Promise<TCache> {
    const serializedOTP = await this.redisRepository.get(
      this.getCacheKey(userId),
    );
    if (!serializedOTP) throw new VerificationCodeNotFoundException();

    return JSON.parse(serializedOTP);
  }

  async createCache(
    userId: UserId,
    id: string,
    channelId: number,
    encryptedVerificationCode?: EncryptedVerificationCode,
  ): Promise<TCache> {
    const verificationCache = this.constructCache(
      id,
      channelId,
      encryptedVerificationCode,
    );

    await this.redisRepository.set(
      this.getCacheKey(userId),
      JSON.stringify(verificationCache),
      this.expirationInMinutes * 60,
    );
    return verificationCache;
  }

  async deleteCache(userId: UserId) {
    await this.redisRepository.delete(this.getCacheKey(userId));
  }

  async changeCachedVerificationCode(
    userId: UserId,
    encryptedVerificationCode?: EncryptedVerificationCode,
  ) {
    const verificationStore = await this.getCache(userId);
    verificationStore.otp = encryptedVerificationCode || null;
    const currentTtl = await this.redisRepository.ttl(this.getCacheKey(userId));

    await this.redisRepository.set(
      this.getCacheKey(userId),
      JSON.stringify(verificationStore),
      currentTtl,
    );
  }

  getCookie(cookies: Record<string, unknown>): TCookie {
    return cookies[this.getCookieKey()] as TCookie;
  }

  setCookie(response: Response, data: TCookie) {
    response.cookie(this.getCookieKey(), data, {
      ...authCookieOptions,
      maxAge: this.expirationInMinutes * 1000 * 60,
    });
  }

  clearCookie(response: Response) {
    response.clearCookie(this.getCookieKey());
  }
}
