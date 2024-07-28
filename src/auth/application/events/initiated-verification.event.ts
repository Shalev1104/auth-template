import { InitiatedVerificationEvent } from '@auth/domain/events/initiated-verification.event';
import { RequestedOtpVerificationCodeEvent } from '@auth/domain/events/requested-otp-verification.event';
import { CacheVerificationEvent } from '@auth/domain/events/cache-verification.event';
import { OtpVerification } from '@auth/domain/value-objects/VerificationCode';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(InitiatedVerificationEvent)
export class InitiatedVerificationEventHandler implements IEventHandler {
  constructor(protected readonly eventBus: EventBus) {}

  async handle({
    user,
    id,
    channelId,
    verificationStore,
  }: InitiatedVerificationEvent) {
    const otpVerification = OtpVerification.safeParse(channelId);
    if (otpVerification.success)
      return this.eventBus.publish(
        new RequestedOtpVerificationCodeEvent(
          user,
          id,
          otpVerification.data,
          verificationStore,
        ),
      );

    return this.eventBus.publish(
      new CacheVerificationEvent(user, id, channelId, verificationStore, false),
    );
  }
}
