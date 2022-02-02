import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_SECRET } from 'src/env.constants';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: AUTH_SECRET,
      signOptions: { expiresIn: '1 day' },
    }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
