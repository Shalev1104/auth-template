import { ICommand, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserWithEmailAndPasswordLogin } from '@auth/domain/User.aggregate';
import { OtpService } from '@auth/application/services/verification/otp.service';
import { OtpVerificator } from '@auth/application/services/verification/verificator.service';
import { CacheVerificationEvent } from '@auth/domain/events/cache-verification.event';
import { IVerificationStore } from '@auth/application/services/verification/stores/verification-store.base.service';

export class SendVerificationCodeCommand implements ICommand {
  constructor(
    public readonly user: UserWithEmailAndPasswordLogin,
    public readonly id: string,
    public readonly otpVerificator: OtpVerificator,
    public readonly verificationStore: IVerificationStore,
    public readonly resend: boolean,
  ) {}
}

export type SendVerificationCodeCommandResult = Promise<void>;

@CommandHandler(SendVerificationCodeCommand)
export class SendVerificationCodeCommandHandler
  implements ICommandHandler<SendVerificationCodeCommand>
{
  constructor(private readonly otpService: OtpService) {}

  async execute(
    command: SendVerificationCodeCommand,
  ): SendVerificationCodeCommandResult {
    const { user, id, otpVerificator, verificationStore, resend } = command;

    const verificationCode = await this.otpService.generateOneTimePassword();
    const encryptedVerificationCode =
      await this.otpService.encryptOneTimePassword(verificationCode);

    await otpVerificator.sendVerificationCode(user, verificationCode);
    user.apply(
      new CacheVerificationEvent(
        user,
        id,
        otpVerificator.channelId,
        verificationStore,
        resend,
        encryptedVerificationCode,
      ),
    );

    user.commit();
  }
}
