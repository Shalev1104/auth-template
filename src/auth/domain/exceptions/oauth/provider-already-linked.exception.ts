import { ConflictException } from '@nestjs/common';

export class ProviderAlreadyLinkedException extends ConflictException {
  constructor() {
    super('The selected provider is already linked to this account');
  }
}
