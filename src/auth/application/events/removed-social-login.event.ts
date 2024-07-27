import { RemovedSocialLoginEvent } from '@auth/domain/events/removed-social-login.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(RemovedSocialLoginEvent)
export class RemovedSocialLoginEventHandler implements IEventHandler {
  private readonly logger = new Logger(RemovedSocialLoginEventHandler.name);

  async handle({ user, socialLogin }: RemovedSocialLoginEvent) {
    this.logger.log(`User ${user.userId} removed Social Login:`, socialLogin);
  }
}
