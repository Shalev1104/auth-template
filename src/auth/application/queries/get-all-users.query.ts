import { UserMapper } from '@auth/infrastructure/database/user.mapper';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
require('./custom/user-aggregate');

export class GetAllUsersQuery implements IQuery {}

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery>
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
        .getMany()
    )
      .map(this.userMapper.toDomain)
      .map(this.userMapper.toResponseDTO);
  }
}
