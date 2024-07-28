import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import {
  User,
  UserId,
  UserWithEmailAndPasswordLogin,
} from '@auth/domain/User.aggregate';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { Enabled2FAEvent } from '@auth/domain/events/enabled-2fa.event';
import { Disabled2FAEvent } from '@auth/domain/events/disabled-2fa.event';
import { VerificationNotFoundException } from '@auth/domain/exceptions/2fa/verification-not-found.exception';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { Inject } from '@nestjs/common';
import { VerificationId } from '@auth/domain/entities/Verification.entity';
import { ITwoFactorAuthenticationRepository } from '@auth/domain/ports/two-factor-authentication.repository';

export class Set2FACommand implements ICommand {
  constructor(
    public readonly userId: UserId,
    public readonly verificationId?: VerificationId,
  ) {}
}

export type Set2FACommandResult = Promise<void>;

@CommandHandler(Set2FACommand)
export class Set2FACommandHandler implements ICommandHandler<Set2FACommand> {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(ITwoFactorAuthenticationRepository)
    private readonly twoFactorAuthenticationRepository: ITwoFactorAuthenticationRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async enable2fa(
    user: UserWithEmailAndPasswordLogin,
    verificationId: VerificationId,
  ) {
    const isAlreadyEnabled =
      user.emailAndPasswordLogin.isEnabled2FA(verificationId);
    if (isAlreadyEnabled) return;

    const verification =
      user.emailAndPasswordLogin.verifications.get(verificationId);
    if (!verification) throw new VerificationNotFoundException();

    user.emailAndPasswordLogin.enable2FA(verification);
    user.apply(new Enabled2FAEvent(user));

    await this.userRepository.save(user);
  }

  async disable2fa(user: UserWithEmailAndPasswordLogin) {
    const isAlreadyDisabled = !user.emailAndPasswordLogin.isEnabled2FA();
    if (isAlreadyDisabled) return;

    user.apply(new Disabled2FAEvent(user));

    await this.twoFactorAuthenticationRepository.delete(user.userId);
  }

  async execute({
    userId,
    verificationId,
  }: Set2FACommand): Set2FACommandResult {
    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(await this.userRepository.getUserById(userId)),
    );

    if (!user.isEmailAndPasswordUser()) throw new UserNotPermittedException();

    if (verificationId) await this.enable2fa(user, verificationId);
    else await this.disable2fa(user);

    user.commit();
  }
}
