import { Verification } from '../entities/Verification.entity';

export class RemovedVerificationEvent {
  constructor(public readonly verification: Verification) {}
}
