import { IVerificationStore } from '@auth/application/services/verification/stores/verification-store.base.service';
import { UserWithEmailAndPasswordLogin } from '../User.aggregate';
import { OtpVerification } from '../value-objects/VerificationCode';

export class RequestedOtpVerificationCodeEvent {
  constructor(
    public readonly user: UserWithEmailAndPasswordLogin,
    public readonly id: string,
    public readonly channelId: OtpVerification,
    public readonly verificationStore: IVerificationStore,
    public readonly resend: boolean = false,
  ) {}
}
