import { BadRequestException, Injectable } from '@nestjs/common';
import formatSize from 'filesize';
import { Stats } from 'fs';
import { lstat, readdir, realpath } from 'fs/promises';
import { basename, dirname, join } from 'path';

import { FileInfo } from './entities/file-info.entity';
import { FileInfoList } from './entities/file-info-list.entity';
import { FileType } from './entities/file-type.enum';

@Injectable()
export class FilesService {
  async getFileInfo(path: string, accurate: boolean): Promise<FileInfo> {
    const stats = await lstat(path).catch(() => {
      throw new BadRequestException(`"${path}" must be accessible`);
    });
    const info: FileInfo = {
      name: basename(path),
      dirname: dirname(path),
      type: this.getFileType(stats),
      size: stats.size,
      sizeFormatted: this.formatSize(stats.size),
      modifiedAt: stats.mtime,
    };

    if (info.type == FileType.Directory && accurate) {
      info.size = await this.getDirectorySize(path);
      info.sizeFormatted = this.formatSize(info.size);
    }
    if (info.type == FileType.Symlink) {
      info.realpath = await realpath(path);
    }

    return info;
  }

  async getChildrenFileInfo(
    path: string,
    offset: number,
  ): Promise<FileInfoList> {
    const filenames = await readdir(path).catch(() => {
      throw new BadRequestException(`"${path}" must be a accessible directory`);
    });
    const LIMIT = 50;
    const filenamesSliced = filenames.slice(offset, offset + LIMIT);
    const filepaths = filenamesSliced.map((filename) => join(path, filename));
    const items = await Promise.all(
      filepaths.map((path) => this.getFileInfo(path, false)),
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

  private async getDirectorySize(path: string): Promise<number> {
    const filenames = await readdir(path);
    const paths = filenames.map((name) => join(path, name));
    let total = 0;
    await Promise.all(
      paths.map(async (path) => {
        try {
          const stats = await lstat(path);
          const size = stats.isFile()
            ? stats.size
            : stats.isDirectory()
            ? await this.getDirectorySize(path)
            : 0;
          total += size;
        } catch {}
      }),
    );
    return total;
  }

  private formatSize(size: number): string {
    return formatSize(size, { base: 2, standard: 'jedec' });
  }
}
