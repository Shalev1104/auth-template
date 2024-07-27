import { UserCreatedEvent } from '@auth/domain/events/user-created.event';
import { AuthMailService } from '@auth/infrastructure/mail/auth-mail.service';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(private readonly authMailService: AuthMailService) {}

  async handle({ user, registeredWith }: UserCreatedEvent): Promise<void> {
    const registerationEmail = user.getLoginAccountEmail(registeredWith);
    if (!registerationEmail) return;

    return this.authMailService.sendWelcomeMail(registerationEmail, user.name);
  }
}
