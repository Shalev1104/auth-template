import { UserNotFoundException } from '@auth/domain/exceptions/user-not-found.exception';
import { UserId } from '@auth/domain/User.aggregate';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { UserMapper } from '@auth/infrastructure/database/user.mapper';
import { Authenticate } from '@common/infrastructure/http/decorators/authenticate.decorator';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';

export class GetUserClaimsQuery implements IQuery {
  constructor(public readonly authenticatedUserId: UserId) {}
}

@QueryHandler(GetUserClaimsQuery)
@Authenticate()
export class GetUserClaimsQueryHandler
  implements IQueryHandler<GetUserClaimsQuery>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async execute(query: GetUserClaimsQuery) {
    const user = await this.userRepository.getUserById(
      query.authenticatedUserId.toString(),
    );
    if (!user) throw new UserNotFoundException();
    return this.userMapper.toResponseDTO(user);
  }
}
