import { createUnionType, Field, ObjectType } from '@nestjs/graphql';

import { FileInfo, FileInfoPartial } from './file-info.entity';

export const FileInfoListItem = createUnionType({
  name: 'FileInfoListItem',
  types: () => [FileInfo, FileInfoPartial],
});

@ObjectType()
export class FileInfoList {
  @Field()
  offset: number;

  @Field()
  total: number;

  @Field(() => [FileInfoListItem])
  items: typeof FileInfoListItem[];
}
