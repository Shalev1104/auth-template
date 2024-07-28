import { Disabled2FAEvent } from '@auth/domain/events/disabled-2fa.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(Disabled2FAEvent)
export class Disabled2FAEventHandler implements IEventHandler {
  private readonly logger = new Logger(Disabled2FAEvent.name);

  async handle({ user }: Disabled2FAEvent) {
    this.logger.log(`User ${user.userId} disabled 2fa`);
  }
}
