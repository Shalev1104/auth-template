import { AttemptedConfirm2FAEvent } from '@auth/domain/events/attempted-confirm-2fa';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AttemptedConfirm2FAEvent)
export class AttemptedConfirm2FAEventHandler implements IEventHandler {
  private readonly logger = new Logger(AttemptedConfirm2FAEvent.name);

  async handle({ user }: AttemptedConfirm2FAEvent) {
    this.logger.log(`User ${user.userId} attempted to confirm 2fa`);
  }
}
