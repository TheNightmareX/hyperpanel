import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ExpressContext } from 'apollo-server-express';

@Injectable()
export class AuthGuard implements CanActivate {
  static skip = (value = true): CustomDecorator<typeof AuthGuard['skip']> =>
    SetMetadata(AuthGuard.skip, value);

  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(contextRaw: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(contextRaw);

    const shouldSkip = this.reflector.getAllAndOverride(AuthGuard.skip, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (shouldSkip) return true;

    const request = context.getContext<ExpressContext>().req;
    const token = this.parseToken(request.headers.authorization ?? '');
    if (!token) throw new UnauthorizedException();
    await this.jwtService.verifyAsync(token).catch(() => {
      throw new UnauthorizedException();
    });
    return true;
  }

  private parseToken(authorization: string): string | null {
    const prefix = 'Bearer ';
    return authorization.startsWith(prefix)
      ? authorization.slice(prefix.length)
      : null;
  }
}
