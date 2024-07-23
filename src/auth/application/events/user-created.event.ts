import { UserCreatedEvent } from '@auth/domain/events/user-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly logger = new Logger(UserCreatedEventHandler.name);

  async handle({ userId }: UserCreatedEvent): Promise<void> {
    this.logger.log('New User Created:', userId);
  }
}
