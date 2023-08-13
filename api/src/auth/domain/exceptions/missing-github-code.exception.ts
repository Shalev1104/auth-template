import { BadRequestException } from '@nestjs/common';

export class MissingGithubCode extends BadRequestException {
  constructor() {
    super('Cannot connect to github, missing query code');
  }
}
