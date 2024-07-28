import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITwoFactorAuthenticationRepository } from '@auth/domain/ports/two-factor-authentication.repository';
import { TwoFactorAuthenticationSchema } from '@common/infrastructure/database/typeorm/schemas/twoFactorAuthentication.schema';
import { UserId } from '@auth/domain/User.aggregate';

@Injectable()
export class TwoFactorAuthenticationRepository
  implements ITwoFactorAuthenticationRepository
{
  constructor(
    @InjectRepository(TwoFactorAuthenticationSchema)
    private readonly twoFactorAuthenticationDbContext: Repository<TwoFactorAuthenticationSchema>,
  ) {}

  delete = async (userId: UserId) => {
    const entity = await this.twoFactorAuthenticationDbContext.findOneBy({
      userId,
    });
    if (!entity) return undefined;
    return await this.twoFactorAuthenticationDbContext.remove(entity);
  };
}
