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

  @Mutation(() => [FileInfo])
  async createFiles(
    @Args('paths', { type: () => [String] }) paths: string[],
  ): Promise<FileInfo[]> {
    return this.filesService.createFiles(paths);
  }

  @Mutation(() => [FileInfo])
  async createDirectories(
    @Args('paths', { type: () => [String] }) paths: string[],
  ): Promise<FileInfo[]> {
    return this.filesService.createDirectories(paths);
  }

  @Mutation(() => FileInfo)
  async renameFile(
    @Args('path') path: string,
    @Args('newName') newName: string,
  ): Promise<FileInfo> {
    return this.filesService.renameFile(path, newName);
  }

  @Mutation(() => [FileInfo])
  async moveFiles(
    @Args('sourcePaths', { type: () => [String] }) sourcePaths: string[],
    @Args('targetDirPath') targetDirPath: string,
  ): Promise<FileInfo[]> {
    return this.filesService.moveFiles(sourcePaths, targetDirPath);
  }

  @Mutation(() => [FileInfo])
  async copyFiles(
    @Args('sourcePaths', { type: () => [String] }) sourcePaths: string[],
    @Args('targetDirPath') targetDirPath: string,
  ): Promise<FileInfo[]> {
    return this.filesService.copyFiles(sourcePaths, targetDirPath);
  }
}
