import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ExpressContext } from 'apollo-server-express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      GqlExecutionContext.create(context).getContext<ExpressContext>().req;
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
