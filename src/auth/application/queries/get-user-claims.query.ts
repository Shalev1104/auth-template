import { UserId } from '@auth/domain/User.aggregate';
import { UserNotFoundException } from '@auth/domain/exceptions/user-not-found.exception';
import { UserMapper } from '@auth/infrastructure/database/user.mapper';
import { UserResponseDto } from '@auth/infrastructure/http/dtos/user.dto';
import { UserSchema } from '@common/infrastructure/database/typeorm/schemas/user.schema';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
require('./custom/user-aggregate');

export class GetAuthenticatedUserQuery implements IQuery {
  constructor(public readonly userId: UserId) {}
}

@QueryHandler(GetAuthenticatedUserQuery)
export class GetAuthenticatedUserQueryHandler
  implements IQueryHandler<GetAuthenticatedUserQuery>
{
  constructor(
    private readonly datasource: DataSource,
    private readonly userMapper: UserMapper,
  ) {}

  async execute({
    userId,
  }: GetAuthenticatedUserQuery): Promise<UserResponseDto> {
    const query = await this.datasource
      .createQueryBuilder(UserSchema, 'users')
      .userAggregate()
      .where('users.userId = :userId', { userId })
      .getOne();

    if (!query) throw new UserNotFoundException();

    return this.userMapper.toResponseDTO(this.userMapper.toDomain(query));
  }
}
