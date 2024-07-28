import { UserMapper } from '@auth/infrastructure/database/user.mapper';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
require('./custom/user-aggregate');

export class GetAllTwoFactorAuthenticationUsersQuery implements IQuery {}

@QueryHandler(GetAllTwoFactorAuthenticationUsersQuery)
export class GetAllTwoFactorAuthenticationUsersQueryHandler
  implements IQueryHandler<GetAllTwoFactorAuthenticationUsersQuery>
{
  constructor(
    private readonly datasource: DataSource,
    private readonly userMapper: UserMapper,
  ) {}

  async execute() {
    return (
      await this.datasource
        .createQueryBuilder(UserSchema, 'users')
        .userAggregate()
        .where('twoFactorAuthentication.userId IS NOT NULL')
        .getMany()
    )
      .map(this.userMapper.toDomain)
      .map(this.userMapper.toResponseDTO);
  }
}
