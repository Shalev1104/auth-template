import { RemovedVerificationEvent } from '@auth/domain/events/verification-removed.event';
import { getChannelName } from '@common/infrastructure/database/typeorm/enums/OtpChannel.enum';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(RemovedVerificationEvent)
export class RemovedVerificationEventHandler implements IEventHandler {
  private readonly logger = new Logger(RemovedVerificationEvent.name);

  async handle({ verification }: RemovedVerificationEvent) {
    this.logger.log(
      `User removed ${getChannelName(verification.channelId)} verification`,
    );
  }
}
