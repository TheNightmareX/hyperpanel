import { BadRequestException, Injectable } from '@nestjs/common';
import fileSize from 'filesize';
import { Stats } from 'fs';
import { lstat, readdir } from 'fs/promises';
import { basename, join } from 'path';

import { FileStatus } from './entities/file-status.entity';
import { FileStatusList } from './entities/file-status-list.entity';
import { FileType } from './entities/file-type.enum';

@Injectable()
export class FilesService {
  async getStatus(path: string): Promise<FileStatus> {
    const stats = await lstat(path).catch(() => {
      throw new BadRequestException(`"${path}" must be accessible`);
    });
    return {
      name: basename(path),
      type: this.getFileType(stats),
      size: stats.size,
      sizeFormatted: fileSize(stats.size),
      modifiedAt: stats.mtime,
    };
  }

  async getChildrenStatuses(
    path: string,
    offset: number,
  ): Promise<FileStatusList> {
    const filenames = await readdir(path).catch(() => {
      throw new BadRequestException(`"${path}" must be a accessible directory`);
    });
    const LIMIT = 50;
    const filenamesSliced = filenames.slice(offset, offset + LIMIT);
    const filepaths = filenamesSliced.map((filename) => join(path, filename));
    const items = await Promise.all(
      filepaths.map((path) => this.getStatus(path)),
    );
    return {
      offset,
      total: filenames.length,
      items,
    };
  }

  private getFileType(stats: Stats): FileType {
    return stats.isFile()
      ? FileType.File
      : stats.isDirectory()
      ? FileType.Directory
      : stats.isSymbolicLink()
      ? FileType.Symlink
      : stats.isSocket()
      ? FileType.Socket
      : FileType.Other;
  }
}
