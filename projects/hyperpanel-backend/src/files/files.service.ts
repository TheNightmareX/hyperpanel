import { BadRequestException, Injectable } from '@nestjs/common';
import fileSize from 'filesize';
import { Stats } from 'fs';
import { lstat } from 'fs/promises';
import { basename } from 'path';

import { FileStatus } from './entities/file-status.entity';
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
