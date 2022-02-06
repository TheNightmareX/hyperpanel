import { Injectable } from '@nestjs/common';
import formatSize from 'filesize';
import { Stats } from 'fs';
import * as fs from 'fs/promises';
import * as pathLib from 'path';

import { FileInfo } from './entities/file-info.entity';
import { FileInfoList } from './entities/file-info-list.entity';
import { FileType } from './entities/file-type.enum';

@Injectable()
export class FilesService {
  async getFileInfo(path: string, accurate: boolean): Promise<FileInfo> {
    const stats = await fs.stat(path);

    const info: FileInfo = {
      name: pathLib.basename(path),
      dirname: pathLib.dirname(path),
      type: this.getFileType(stats),
      size: stats.size,
      sizeFormatted: this.formatSize(stats.size),
      modifiedAt: stats.mtime,
      realpath: await this.getRealpath(path),
    };

    if (info.type == FileType.Directory && accurate) {
      info.size = await this.getDirectorySize(path);
      info.sizeFormatted = this.formatSize(info.size);
    }

    return info;
  }

  async getChildrenFileInfo(
    path: string,
    offset: number,
  ): Promise<FileInfoList> {
    const filenames = await fs.readdir(path);
    const LIMIT = 50;
    const filenamesSliced = filenames.slice(offset, offset + LIMIT);
    const filepaths = filenamesSliced.map((filename) =>
      pathLib.join(path, filename),
    );
    const items = await Promise.all(
      filepaths.map((path) => this.getFileInfo(path, false)),
    );
    return {
      offset,
      total: filenames.length,
      items,
    };
  }

  async renameFile(path: string, newName: string): Promise<string> {
    const dirPath = pathLib.dirname(path);
    const newPath = pathLib.join(dirPath, newName);
    await fs.rename(path, newPath);
    return newPath;
  }

  async moveFiles(
    sourcePaths: string[],
    targetDirPath: string,
  ): Promise<string[]> {
    const tasks = sourcePaths.map(async (sourcePath) => {
      const filename = pathLib.basename(sourcePath);
      const targetPath = pathLib.join(targetDirPath, filename);
      await fs.rename(sourcePath, targetPath);
      return targetPath;
    });
    const resultPaths = await Promise.all(tasks);
    return resultPaths;
  }

  private getFileType(stats: Stats): FileType {
    return stats.isFile()
      ? FileType.File
      : stats.isDirectory()
      ? FileType.Directory
      : stats.isSocket()
      ? FileType.Socket
      : FileType.Other;
  }

  private async getDirectorySize(path: string): Promise<number> {
    const filenames = await fs.readdir(path);
    const paths = filenames.map((name) => pathLib.join(path, name));
    let total = 0;
    await Promise.all(
      paths.map(async (path) => {
        try {
          const stats = await fs.stat(path);
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

  private async getRealpath(path: string): Promise<string | null> {
    const result = await fs.realpath(path);
    return result == path ? null : result;
  }

  private formatSize(size: number): string {
    return formatSize(size, { base: 2, standard: 'jedec' });
  }
}
