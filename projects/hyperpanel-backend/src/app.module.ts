import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, NotFoundException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { DB_PATH, DEBUG } from './env.constants';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: DEBUG,
      playground: DEBUG,
    }),
    MikroOrmModule.forRoot({
      type: 'sqlite',
      dbName: DB_PATH,
      autoLoadEntities: true,
      forceUndefined: true,
      findOneOrFailHandler: () => new NotFoundException(),
      debug: DEBUG,
    }),
  ],
})
export class AppModule {}
