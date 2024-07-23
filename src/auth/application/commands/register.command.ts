import { AccessToken, RefreshToken } from '@common/infrastructure/http/tokens';
import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { UserFactory } from '../factories/user.factory';
import { AuthenticationService } from '../services/auth.service';
import { RegisterDto } from '@auth/infrastructure/http/dtos/register.dto';
import { LoginProvider } from '@auth/domain/value-objects/LoginProvider';

export class RegisterCommand implements ICommand {
  constructor(public readonly props: RegisterDto) {}
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
      await this.userFactory.createUser(
        LoginProvider.EmailAndPassword,
        command.props,
      ),
    );

    const autheticationTokens =
      await this.authenticationService.createAuthenticationTokens(user.userId);

    user.commit();

    return autheticationTokens;
  }
}
