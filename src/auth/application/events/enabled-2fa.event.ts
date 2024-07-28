import { Enabled2FAEvent } from '@auth/domain/events/enabled-2fa.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(Enabled2FAEvent)
export class Enabled2FAEventHandler implements IEventHandler {
  private readonly logger = new Logger(Enabled2FAEvent.name);

  async handle({ user }: Enabled2FAEvent) {
    this.logger.log(`User ${user.userId} enabled 2fa`);
  }
}
