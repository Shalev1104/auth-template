import { GetUserClaimsQuery } from '@auth/application/queries/get-user-claims.query';
import { AuthenticationService } from '@auth/application/services/authentication.service';
import { Authenticate } from '@common/infrastructure/http/decorators/authenticate.decorator';
import { Routers, RouterRoutes } from '@common/infrastructure/http/routers';
import { Controller, Get, Req } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserResponseDto } from './dtos/user.dto';
import { Request } from 'express';
import { NotAuthenticatedException } from '@auth/domain/exceptions/not-authenticated.exception';

@Controller(Routers.Users)
@Authenticate()
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Get(RouterRoutes.User.Claims)
  async claims(@Req() request: Request) {
    const user = await this.authenticationService.getAuthenticatedUser(request);
    if (!user) throw new NotAuthenticatedException();
    const query = new GetUserClaimsQuery(user.sub);
    return await this.queryBus.execute<GetUserClaimsQuery, UserResponseDto>(
      query,
    );
  }
}
