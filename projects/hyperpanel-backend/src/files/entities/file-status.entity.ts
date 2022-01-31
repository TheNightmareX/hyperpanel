import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileStatus {
  @Field()
  name: string;

  @Field()
  size: number;

  @Field()
  modifiedAt: Date;
}
