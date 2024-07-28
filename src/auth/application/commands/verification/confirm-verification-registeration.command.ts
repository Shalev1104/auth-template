import {
  ICommand,
  CommandHandler,
  ICommandHandler,
  EventPublisher,
} from '@nestjs/cqrs';
import { Verification } from '@auth/domain/entities/Verification.entity';
import { User, UserId } from '@auth/domain/User.aggregate';
import { AddedVerificationEvent } from '@auth/domain/events/added-verification.event';
import {
  OtpVerification,
  VerificationCode,
} from '@auth/domain/value-objects/VerificationCode';
import { IncorrectOTPException } from '@auth/domain/exceptions/2fa/incorrect-otp.exception';
import { UserNotPermittedException } from '@auth/domain/exceptions/not-permitted.exception';
import { Enabled2FAEvent } from '@auth/domain/events/enabled-2fa.event';
import { IUserRepository } from '@auth/domain/ports/user.repository';
import { Inject } from '@nestjs/common';
import {
  AuthenticatorVerificator,
  OtpVerificator,
} from '@auth/application/services/verification/verificator.service';
import { UnidentifiedClientException } from '@auth/domain/exceptions/unidentified-client.exception';
import { SetupVerificationStore } from '@auth/application/services/verification/stores/setup-verification-store.service';

export class ConfirmVerificationRegisterationCommand implements ICommand {
  constructor(
    public readonly userId: UserId,
    public readonly verificationCode: VerificationCode,
    public readonly cookies: Record<string, unknown>,
  ) {}
}

export type ConfirmVerificationRegisterationCommandResult = Promise<void>;

@CommandHandler(ConfirmVerificationRegisterationCommand)
export class ConfirmVerificationRegisterationCommandHandler
  implements ICommandHandler<ConfirmVerificationRegisterationCommand>
{
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly otpVerificator: OtpVerificator,
    private readonly authenticatorVerificator: AuthenticatorVerificator,
    private readonly eventPublisher: EventPublisher,
    private readonly setupVerificationStore: SetupVerificationStore,
  ) {}

  async execute({
    userId,
    verificationCode,
    cookies,
  }: ConfirmVerificationRegisterationCommand): ConfirmVerificationRegisterationCommandResult {
    const user = this.eventPublisher.mergeObjectContext(
      User.getOrFail(await this.userRepository.getUserById(userId)),
    );

    if (!user.isEmailAndPasswordUser()) throw new UserNotPermittedException();

    const confirmationCache = await this.setupVerificationStore.getCache(
      userId,
    );

    const confirmationCookie = this.setupVerificationStore.getCookie(cookies);

    if (confirmationCookie.id !== confirmationCache.id)
      throw new UnidentifiedClientException();

    if (confirmationCache.channelId !== confirmationCookie.channelId)
      throw new UnidentifiedClientException();

    const otpVerificationParser = OtpVerification.safeParse(
      confirmationCache.channelId,
    );
    const isVerified = otpVerificationParser.success
      ? await this.otpVerificator.confirmVerificationCode(
          verificationCode,
          confirmationCache.otp,
        )
      : await this.authenticatorVerificator.confirmVerificationCode(
          verificationCode,
          user,
        );

    if (!isVerified) throw new IncorrectOTPException();

    await this.setupVerificationStore.deleteCache(userId);

    const verification = new Verification({
      channelId: confirmationCache.channelId,
    });

    user.emailAndPasswordLogin.verifications.add(verification);
    user.apply(new AddedVerificationEvent(user, verification));

    if (confirmationCookie.setAsDefault2fa) {
      user.emailAndPasswordLogin.enable2FA(verification);
      user.apply(new Enabled2FAEvent(user));
    }

    await this.userRepository.save(user);
    user.commit();
  }
}
