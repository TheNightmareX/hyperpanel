import { Field, ObjectType } from '@nestjs/graphql';

import { FileInfo } from './file-info.entity';

@ObjectType()
export class FileInfoList {
  @Field()
  offset: number;

  @Field()
  total: number;

  @Field(() => [FileInfo])
  items: FileInfo[];
}
