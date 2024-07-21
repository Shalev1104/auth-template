import { UserNotFoundException } from '@auth/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@auth/infrastructure/database/user.db-repository';
import { UserMapper } from '@auth/infrastructure/database/user.mapper';
import { Authenticate } from '@common/http/decorators/authenticate.decorator';
import { UserId } from '@common/http/user';
import { IQuery, QueryHandler, IQueryHandler } from '@nestjs/cqrs';

export class GetUserClaimsQuery implements IQuery {
  constructor(public readonly authenticatedUser: UserId) {}
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
      query.authenticatedUser.toString(),
    );
    if (!user) throw new UserNotFoundException();
    return this.userMapper.toResponseDTO(user);
  }
}
