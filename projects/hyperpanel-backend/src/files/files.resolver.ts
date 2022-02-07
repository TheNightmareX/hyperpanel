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
    return this.filesService.getChildrenFileInfo(path, offset ?? 0, 50);
  }

  @Mutation(() => FileInfo)
  async createFile(
    @Args('path') path: string,
    @Args('isDirectory', { nullable: true }) isDirectory?: boolean,
  ): Promise<FileInfo> {
    return this.filesService.createFile(path, isDirectory ?? false);
  }

  @Mutation(() => FileInfo)
  async renameFile(
    @Args('path') path: string,
    @Args('newName') newName: string,
  ): Promise<FileInfo> {
    return this.filesService.renameFile(path, newName);
  }

  @Mutation(() => FileInfo)
  async moveFile(
    @Args('sourcePath') sourcePath: string,
    @Args('targetPath') targetPath: string,
  ): Promise<FileInfo> {
    return this.filesService.moveFile(sourcePath, targetPath);
  }

  @Mutation(() => FileInfo)
  async copyFile(
    @Args('sourcePath') sourcePath: string,
    @Args('targetPath') targetPath: string,
  ): Promise<FileInfo> {
    return this.filesService.copyFile(sourcePath, targetPath);
  }

  @Mutation(() => FileInfo)
  async removeFile(@Args('path') path: string): Promise<FileInfo> {
    return this.filesService.removeFile(path);
  }
}
