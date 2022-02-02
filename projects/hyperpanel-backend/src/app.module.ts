import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, NotFoundException } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthModule } from './auth/auth.module';
import { DB_PATH, DEBUG } from './env.constants';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
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
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
