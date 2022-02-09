import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ExpressContext } from 'apollo-server-express';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  static skip = (value = true): CustomDecorator<typeof AuthGuard['skip']> =>
    SetMetadata(AuthGuard.skip, value);

  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const shouldSkip = this.reflector.getAllAndOverride(AuthGuard.skip, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (shouldSkip) return true;

    const request = this.getRequest(context);
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

  private getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() == 'http')
      return context.switchToHttp().getRequest();
    return GqlExecutionContext.create(context).getContext<ExpressContext>().req;
  }
}
