import { BadRequestException } from '@nestjs/common';

export class ProviderNotLinkedException extends BadRequestException {
  constructor() {
    super(`The selected provider is not linked to your account`);
  }
}
