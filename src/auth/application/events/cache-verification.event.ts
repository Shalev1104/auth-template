import { CacheVerificationEvent } from '@auth/domain/events/cache-verification.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(CacheVerificationEvent)
export class CacheVerificationEventHandler implements IEventHandler {
  async handle({
    user,
    id,
    channelId,
    verificationStore,
    encryptedVerificationCode,
    resend,
  }: CacheVerificationEvent) {
    if (resend) {
      return await verificationStore.changeCachedVerificationCode(
        user.userId,
        encryptedVerificationCode,
      );
    }

    await verificationStore.createCache(
      user.userId,
      id,
      channelId,
      encryptedVerificationCode,
    );
  }
}
