import { UserRequestDto } from '@auth/infrastructure/http/dtos/user.dto';
import { AccessToken, RefreshToken } from '@common/infrastructure/http/tokens';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { UserFactory } from '../factories/user.factory';
import { AuthenticationService } from '../services/auth.service';
import { AuthStrategy } from '@common/infrastructure/http/user';

export class RegisterCommand implements ICommand {
  constructor(public readonly props: UserRequestDto) {}
}

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler {
  constructor(
    private readonly userFactory: UserFactory<typeof AuthStrategy.Local>,
    private readonly eventPublisher: EventPublisher,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(
    command: RegisterCommand,
  ): Promise<[AccessToken, RefreshToken]> {
    const user = this.eventPublisher.mergeObjectContext(
      await this.userFactory.create(command.props),
    );

    const autheticationTokens =
      await this.authenticationService.createAuthenticationTokens(user.userId);

    user.commit();

    return autheticationTokens;
  }
}