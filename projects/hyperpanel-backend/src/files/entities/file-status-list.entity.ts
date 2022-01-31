import { Field, ObjectType } from '@nestjs/graphql';

import { FileStatus } from './file-status.entity';

@ObjectType()
export class FileStatusList {
  @Field()
  offset: number;

  @Field()
  total: number;

  @Field(() => [FileStatus])
  items: FileStatus[];
}
