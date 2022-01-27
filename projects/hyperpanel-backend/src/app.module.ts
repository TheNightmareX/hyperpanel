import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, NotFoundException } from '@nestjs/common';

import { DB_PATH } from './env.constants';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      type: 'sqlite',
      dbName: DB_PATH,
      autoLoadEntities: true,
      forceUndefined: true,
      findOneOrFailHandler: () => new NotFoundException(),
    }),
  ],
})
export class AppModule {}
