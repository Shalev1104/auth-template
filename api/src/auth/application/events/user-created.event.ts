import { UserId } from '@common/http/user';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class UserCreatedEvent {
  constructor(public readonly userId: UserId) {}
}

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  private readonly logger = new Logger(UserCreatedEventHandler.name);

  async handle({ userId }: UserCreatedEvent): Promise<void> {
    this.logger.log('New User Created:', userId);
  }
}
