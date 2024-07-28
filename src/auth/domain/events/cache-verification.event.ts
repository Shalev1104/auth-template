import { IVerificationStore } from '@auth/application/services/verification/stores/verification-store.base.service';
import { UserWithEmailAndPasswordLogin } from '../User.aggregate';
import { EncryptedVerificationCode } from '../value-objects/VerificationCode';

export class CacheVerificationEvent {
  constructor(
    public readonly user: UserWithEmailAndPasswordLogin,
    public readonly id: string,
    public readonly channelId: number,
    public readonly verificationStore: IVerificationStore,
    public readonly resend: boolean,
    public readonly encryptedVerificationCode?: EncryptedVerificationCode,
  ) {}
}
