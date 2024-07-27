import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { UserFactory } from '../../factories/user.factory';
import { AuthenticationService } from '../../services/authentication.service';
import { RegisterDto } from '@auth/infrastructure/http/dtos/register.dto';
import { LoginProvider } from '@auth/domain/value-objects/LoginProvider';
import { AuthenticationTokens } from '@auth/domain/value-objects/Tokens';
import { User } from '@auth/domain/User.aggregate';

export class RegisterCommand implements ICommand {
  constructor(public readonly registerDto: RegisterDto) {}
}

export type RegisterCommandResult = Promise<{
  user: User;
  authenticationTokens: AuthenticationTokens;
}>;

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute({ registerDto }: RegisterCommand): RegisterCommandResult {
    const user = this.eventPublisher.mergeObjectContext(
      await this.userFactory.createUser(
        LoginProvider.EmailAndPassword,
        registerDto,
      ),
    );

    const authenticationTokens =
      await this.authenticationService.createAuthenticationTokens(user);

    user.commit();

    return {
      user,
      authenticationTokens,
    };
  }
}
