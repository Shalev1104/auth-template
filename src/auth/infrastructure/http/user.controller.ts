import { GetUserClaimsQuery } from '@auth/application/queries/get-user-claims.query';
import { AuthenticationService } from '@auth/application/services/auth.service';
import { Authenticate } from '@common/infrastructure/http/decorators/authenticate.decorator';
import { Routers, RouterRoutes } from '@common/infrastructure/http/routers';
import { Controller, Get, Req } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { UserResponseDto } from './dtos/user.dto';
import { Request } from 'express';

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
    const query = new GetUserClaimsQuery(user);
    return await this.queryBus.execute<GetUserClaimsQuery, UserResponseDto>(
      query,
    );
  }
}
