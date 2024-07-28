import { IVerificationStore } from '@auth/application/services/verification/stores/verification-store.base.service';
import { UserWithEmailAndPasswordLogin } from '../User.aggregate';

export class InitiatedVerificationEvent {
  constructor(
    public readonly user: UserWithEmailAndPasswordLogin,
    public readonly id: string,
    public readonly channelId: number,
    public readonly verificationStore: IVerificationStore,
  ) {}
}
