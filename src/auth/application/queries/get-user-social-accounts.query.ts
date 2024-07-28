import { UserId } from '@auth/domain/User.aggregate';
import { OAuthLoginSchema } from '@common/infrastructure/database/typeorm/schemas/oAuthLogin.schema';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

export class GetUserSocialAccountsQuery implements IQuery {
  constructor(public readonly userId: UserId) {}
}

@QueryHandler(GetUserSocialAccountsQuery)
export class GetUserSocialAccountsQueryHandler
  implements IQueryHandler<GetUserSocialAccountsQuery>
{
  constructor(private readonly datasource: DataSource) {}

  async execute({ userId }: GetUserSocialAccountsQuery) {
    return this.datasource
      .createQueryBuilder(OAuthLoginSchema, 'user_oauth_logins')
      .where('user_oauth_logins.userId = :userId', { userId })
      .getMany();
  }
}
