import { Args, Query, Resolver } from '@nestjs/graphql';

import { FileStatus } from './entities/file-status.entity';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => FileStatus)
  async fileStatusDetail(@Args('path') path: string): Promise<FileStatus> {
    return this.filesService.getStatus(path);
  }
}
