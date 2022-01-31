import { DefaultValuePipe } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { FileInfo } from './entities/file-info.entity';
import { FileInfoList } from './entities/file-info-list.entity';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => FileInfo)
  async fileInfoDetail(@Args('path') path: string): Promise<FileInfo> {
    return this.filesService.getFileInfo(path);
  }

  @Query(() => FileInfoList)
  async fileInfoList(
    @Args('path') path: string,
    @Args('offset', { nullable: true }, new DefaultValuePipe(0)) offset: number,
  ): Promise<FileInfoList> {
    return this.filesService.getChildrenFileInfo(path, offset);
  }
}
