import { UserRequestDto } from '@auth/infrastructure/http/dtos/user.dto';
import { AccessToken, RefreshToken } from '@common/http/tokens';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { UserFactory } from '../factories/user.factory';
import { AuthenticationService } from '../services/auth.service';

export class RegisterCommand implements ICommand {
  constructor(public readonly props: UserRequestDto) {}
}

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(
    command: RegisterCommand,
  ): Promise<[AccessToken, RefreshToken]> {
    const user = this.eventPublisher.mergeObjectContext(
      await this.userFactory.create(command.props),
    );
    user.commit();

    const autheticationTokens =
      await this.authenticationService.createAuthenticationTokens(user.userId);

    user.updateLastLogin();
    user.commit();

    return autheticationTokens;
  }
}
