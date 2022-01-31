import { DefaultValuePipe } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { FileStatus } from './entities/file-status.entity';
import { FileStatusList } from './entities/file-status-list.entity';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => FileStatus)
  async fileStatusDetail(@Args('path') path: string): Promise<FileStatus> {
    return this.filesService.getStatus(path);
  }

  @Query(() => FileStatusList)
  async fileStatusList(
    @Args('path') path: string,
    @Args('offset', { nullable: true }, new DefaultValuePipe(0)) offset: number,
  ): Promise<FileStatusList> {
    return this.filesService.getChildrenStatuses(path, offset);
  }
}
