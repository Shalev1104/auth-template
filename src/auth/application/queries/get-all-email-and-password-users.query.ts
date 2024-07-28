import { UserMapper } from '@auth/infrastructure/database/user.mapper';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
require('./custom/user-aggregate');

export class GetAllEmailAndPasswordUsersQuery implements IQuery {}

@QueryHandler(GetAllEmailAndPasswordUsersQuery)
export class GetAllEmailAndPasswordUsersQueryHandler
  implements IQueryHandler<GetAllEmailAndPasswordUsersQuery>
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
        .where('emailAndPasswordLogin.loginId IS NOT NULL')
        .getMany()
    )
      .map(this.userMapper.toDomain)
      .map(this.userMapper.toResponseDTO);
  }
}
