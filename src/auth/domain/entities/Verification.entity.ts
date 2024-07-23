import { Entity } from '@common/domain/entity';
import { Uuid } from '@common/domain/value-objects/Uuid';
import { z } from 'zod';

interface IVerification {
  verificationId?: string;
  channelId: number;
}

export const VerificationId = Uuid;
export type VerificationId = z.infer<typeof VerificationId>;

export class Verification extends Entity<VerificationId> {
  private readonly _channelId: number;
  constructor(verification: IVerification) {
    super(verification.verificationId);
    this._channelId = verification.channelId;
  }

  get verificationId() {
    return this.entityId;
  }

  get channelId() {
    return this._channelId;
  }
}
