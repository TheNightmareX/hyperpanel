import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_PASSWORD, AUTH_USERNAME } from 'src/env.constants';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async authorize(username: string, password: string): Promise<string> {
    const isValid = username == AUTH_USERNAME && password == AUTH_PASSWORD;
    if (!isValid) throw new UnauthorizedException();
    return this.jwtService.signAsync({ username });
  }
}
