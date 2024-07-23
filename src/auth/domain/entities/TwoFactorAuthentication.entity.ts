import { Entity } from '@common/domain/entity';
import { VerificationId } from './Verification.entity';

interface ITwoFactorAuthentication {
  verificationId: VerificationId;
}

export class TwoFactorAuthentication extends Entity<VerificationId> {
  constructor(twoFactorAuthentication: ITwoFactorAuthentication) {
    super(twoFactorAuthentication.verificationId);
  }

  get verificationId() {
    return this.entityId;
  }
}
