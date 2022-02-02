import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  async authorization(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<string> {
    return this.authService.authorize(username, password);
  }
}
