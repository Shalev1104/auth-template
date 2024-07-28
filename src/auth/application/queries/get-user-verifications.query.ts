import { UserId } from '@auth/domain/User.aggregate';
import { TwoFactorAuthenticationSchema } from '@common/infrastructure/database/typeorm/schemas/twoFactorAuthentication.schema';
import { VerificationSchema } from '@common/infrastructure/database/typeorm/schemas/verifications.schema';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

export class GetUserVerificationsQuery implements IQuery {
  constructor(public readonly userId: UserId) {}
}

@QueryHandler(GetUserVerificationsQuery)
export class GetUserVerificationsQueryHandler
  implements IQueryHandler<GetUserVerificationsQuery>
{
  constructor(private readonly datasource: DataSource) {}

  async execute({ userId }: GetUserVerificationsQuery) {
    const verifications = await this.datasource
      .createQueryBuilder(VerificationSchema, 'user_verifications')
      .where('user_verifications.user_id = :userId', { userId })
      .orderBy('user_verifications.channel_id', 'ASC')
      .getMany();

    const twoFactorAuthentication = await this.datasource
      .createQueryBuilder(
        TwoFactorAuthenticationSchema,
        'user_two_factor_authentication',
      )
      .where('user_two_factor_authentication.user_id = :userId', { userId })
      .getOne();

    return {
      verifications,
      twoFactorAuthentication,
    };
  }
}
