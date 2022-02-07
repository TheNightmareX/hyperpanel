import { Field, Float, ObjectType } from '@nestjs/graphql';

import { FileType } from './file-type.enum';

@ObjectType()
export class FileInfo {
  @Field()
  name: string;

  @Field()
  dirname: string;

  @Field()
  path: string;

  @Field({ nullable: true })
  realpath?: string;

  @Field()
  type: FileType;

  @Field(() => Float) // big int
  size: number;

  @Field()
  sizeFormatted: string;

  @Field()
  modifiedAt: Date;
}
