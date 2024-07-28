import { ICommand, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { User, UserId } from '@auth/domain/User.aggregate';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { OtpVerification } from '@auth/domain/value-objects/VerificationCode';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { Inject } from '@nestjs/common';
import { RequestedOtpVerificationCodeEvent } from '@auth/domain/events/requested-otp-verification.event';
import { IVerificationStore } from '@auth/application/services/verification/stores/verification-store.base.service';
import { SetupVerificationStore } from '@auth/application/services/verification/stores/setup-verification-store.service';
import { LoginVerificationStore } from '@auth/application/services/verification/stores/login-verification-store.service';

export class ResendVerificationCodeCommand implements ICommand {
  constructor(
    public readonly userId: UserId | undefined,
    public readonly cookies: Record<string, unknown>,
  ) {}
}

export type ResendVerificationCodeCommandResult = Promise<void>;

@CommandHandler(ResendVerificationCodeCommand)
export class ResendVerificationCodeCommandHandler {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly setupVerificationStore: SetupVerificationStore,
    private readonly loginVerificationStore: LoginVerificationStore,
  ) {}

  async execute(
    command: ResendVerificationCodeCommand,
  ): ResendVerificationCodeCommandResult {
    let user: User;
    let verificationStore: IVerificationStore;

    if (command.userId) {
      user = this.eventPublisher.mergeObjectContext(
        User.getOrFail(await this.userRepository.getUserById(command.userId)),
      );
      verificationStore = this.setupVerificationStore;
    } else {
      const loginVerificationData = this.loginVerificationStore.getCookie(
        command.cookies,
      );
      user = this.eventPublisher.mergeObjectContext(
        User.getOrFail(
          await this.userRepository.getUserById(loginVerificationData.userId),
        ),
      );
      verificationStore = this.loginVerificationStore;
    }

    if (!user.isEmailAndPasswordUser()) throw new UserNotPermittedException();

    const verification = await verificationStore.getCache(user.userId);

    const otpVerification = OtpVerification.safeParse(verification.channelId);
    if (otpVerification.success) {
      user.apply(
        new RequestedOtpVerificationCodeEvent(
          user,
          verification.id,
          otpVerification.data,
          verificationStore,
          true,
        ),
      );
      user.commit();
    }
  }
}
