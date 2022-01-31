import { registerEnumType } from '@nestjs/graphql';

export enum FileType {
  File,
  Directory,
  Symlink,
  Socket,
  Other,
}

registerEnumType(FileType, { name: 'FileType' });
