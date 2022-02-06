import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FileInfo } from './entities/file-info.entity';
import { FileInfoList } from './entities/file-info-list.entity';
import { FilesService } from './files.service';
import { FilesErrorFilter } from './files-error.filter';

@UseFilters(FilesErrorFilter)
@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => FileInfo)
  async fileInfoDetail(
    @Args('path') path: string,
    @Args('accurate', { nullable: true }) accurate?: boolean,
  ): Promise<FileInfo> {
    return this.filesService.getFileInfo(path, accurate ?? false);
  }

  @Query(() => FileInfoList)
  async fileInfoList(
    @Args('path') path: string,
    @Args('offset', { nullable: true }) offset?: number,
  ): Promise<FileInfoList> {
    return this.filesService.getChildrenFileInfo(path, offset ?? 0);
  }

  @Mutation(() => [String])
  async moveFiles(
    @Args('sourcePaths', { type: () => [String] }) sourcePaths: string[],
    @Args('targetDirPath') targetDirPath: string,
  ): Promise<string[]> {
    return this.filesService.moveFiles(sourcePaths, targetDirPath);
  }
}
