import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @AuthGuard.skip(true)
  @Mutation(() => String)
  async authorize(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<string> {
    return this.authService.authorize(username, password);
  }
}
