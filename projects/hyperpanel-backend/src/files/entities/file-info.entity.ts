import { Field, ObjectType } from '@nestjs/graphql';

import { FileType } from './file-type.enum';

@ObjectType()
export class FileInfo {
  @Field()
  name: string;

  @Field()
  dirname: string;

  @Field()
  type: FileType;

  @Field()
  size: number;

  @Field()
  sizeFormatted: string;

  @Field()
  modifiedAt: Date;

  @Field({ nullable: true })
  extension?: string;
}
