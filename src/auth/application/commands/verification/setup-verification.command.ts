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
import { TotpVerification } from '@auth/domain/value-objects/VerificationCode';
import { TotpService } from '../../services/verification/totp.service';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { Verification } from '@auth/domain/entities/Verification.entity';
import { InitiatedVerificationEvent } from '@auth/domain/events/initiated-verification.event';
import { SetupVerificationStore } from '@auth/application/services/verification/stores/setup-verification-store.service';
import { VerificationAlreadyExistException } from '@auth/domain/exceptions/2fa/verification-already-exist.exception';
import { Inject } from '@nestjs/common';
import { IUserRepository } from '@auth/domain/ports/user.repository';

export class SetupVerificationCommand implements ICommand {
  constructor(
    public readonly userId: UserId,
    public readonly channelId: number,
  ) {}
}

export type SetupVerificationCommandResult = Promise<{
  user: UserWithEmailAndPasswordLogin;
  verification: Verification;
}>;

@CommandHandler(SetupVerificationCommand)
export class SetupVerificationCommandHandler implements ICommandHandler {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly totpService: TotpService,
    private readonly setupVerificationStore: SetupVerificationStore,
  ) {}

  async execute(
    command: SetupVerificationCommand,
  ): SetupVerificationCommandResult {
    const { userId, channelId } = command;

    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(await this.userRepository.getUserById(userId)),
    );
    if (!user.isEmailAndPasswordUser()) throw new UserNotPermittedException();

    if (
      [...user.emailAndPasswordLogin.verifications].some(
        (v) => v.channelId === channelId,
      )
    )
      throw new VerificationAlreadyExistException();

    const verification = new Verification({ channelId });
    user.apply(
      new InitiatedVerificationEvent(
        user,
        verification.verificationId,
        channelId,
        this.setupVerificationStore,
      ),
    );

    const totpVerification = TotpVerification.safeParse(channelId);
    if (totpVerification.success) {
      const sharedSecret = this.totpService.generateSharedSecret();
      user.emailAndPasswordLogin.addSharedSecret(sharedSecret);
      await this.userRepository.save(user);
    }
    user.commit();

    return {
      user,
      verification,
    };
  }
}
