import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { User, UserId } from '@auth/domain/User.aggregate';
import { RemovedVerificationEvent } from '@auth/domain/events/verification-removed.event';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { VerificationNotFoundException } from '@auth/domain/exceptions/2fa/verification-not-found.exception';
import { TotpVerification } from '@auth/domain/value-objects/VerificationCode';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { Inject } from '@nestjs/common';
import { VerificationId } from '@auth/domain/entities/Verification.entity';

export class RemoveVerificationCommand implements ICommand {
  constructor(
    public readonly userId: UserId,
    public readonly verificationId: VerificationId,
  ) {}
}

export type RemoveVerificationCommandResult = Promise<void>;

@CommandHandler(RemoveVerificationCommand)
export class RemoveVerificationCommandHandler
  implements ICommandHandler<RemoveVerificationCommand>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    userId,
    verificationId,
  }: RemoveVerificationCommand): RemoveVerificationCommandResult {
    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(await this.userRepository.getUserById(userId)),
    );

    if (!user.isEmailAndPasswordUser()) throw new UserNotPermittedException();

    const verification =
      user.emailAndPasswordLogin.verifications.get(verificationId);
    if (!verification) throw new VerificationNotFoundException();

    user.emailAndPasswordLogin.verifications.delete(verification);
    user.apply(new RemovedVerificationEvent(verification));

    const totpVerification = TotpVerification.safeParse(verification.channelId);
    if (totpVerification.success)
      user.emailAndPasswordLogin.removeSharedSecret();

    await this.userRepository.save(user);
    user.commit();
  }
}
