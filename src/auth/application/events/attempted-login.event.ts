import { AttemptedLoginEvent } from '@auth/domain/events/attempted-login';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AttemptedLoginEvent)
export class AttemptedLoginEventHandler implements IEventHandler {
  private readonly logger = new Logger(AttemptedLoginEvent.name);

  async handle({ user }: AttemptedLoginEvent) {
    this.logger.log(`User ${user.userId} attempted to login`);
  }
}
