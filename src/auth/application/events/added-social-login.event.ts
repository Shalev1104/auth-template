import { AddedSocialLoginEvent } from '@auth/domain/events/added-social-login.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AddedSocialLoginEvent)
export class AddedSocialLoginEventHandler implements IEventHandler {
  private readonly logger = new Logger(AddedSocialLoginEventHandler.name);

  async handle({ user, socialLogin }: AddedSocialLoginEvent) {
    this.logger.log(`User ${user.userId} Added Social Login:`, socialLogin);
  }
}
