import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { FileType } from './file-type.enum';

@ObjectType()
export class FileInfo {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  path: string;

  @Field({ nullable: true })
  realpath?: string;

  @Field(() => FileType)
  type: FileType;

  @Field(() => Float) // big int
  size: number;

  @Field()
  sizeFormatted: string;

  @Field()
  modifiedAt: Date;
}

@ObjectType()
export class FileInfoPartial {
  @Field()
  name: string;

  @Field()
  path: string;
}
