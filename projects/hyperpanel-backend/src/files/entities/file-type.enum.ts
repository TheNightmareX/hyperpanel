import { registerEnumType } from '@nestjs/graphql';

export enum FileType {
  File,
  Directory,
  Socket,
  Other,
}

registerEnumType(FileType, { name: 'FileType' });
