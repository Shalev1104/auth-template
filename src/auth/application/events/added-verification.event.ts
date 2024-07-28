import { AddedVerificationEvent } from '@auth/domain/events/added-verification.event';
import { getChannelName } from '@common/infrastructure/database/typeorm/enums/OtpChannel.enum';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(AddedVerificationEvent)
export class AddedVerificationEventHandler implements IEventHandler {
  private readonly logger = new Logger(AddedVerificationEventHandler.name);

  async handle({ user, verification }: AddedVerificationEvent) {
    this.logger.log(
      `User ${user.userId} Added Verification:`,
      getChannelName(verification.channelId),
    );
  }
}
