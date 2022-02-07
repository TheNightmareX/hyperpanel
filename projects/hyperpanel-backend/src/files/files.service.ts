import { Injectable } from '@nestjs/common';
import formatSize from 'filesize';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as pathLib from 'path';

import { FileInfo } from './entities/file-info.entity';
import { FileInfoList } from './entities/file-info-list.entity';
import { FileType } from './entities/file-type.enum';

@Injectable()
export class FilesService {
  async getFileInfo(path: string, accurate: boolean): Promise<FileInfo> {
    const stats = await fsPromises.stat(path);

    const info: FileInfo = {
      path,
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
    const filenames = await fsPromises.readdir(path);
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
    const newPathCrude = pathLib.join(dirPath, newName);
    const newPath = await this.getNonConflictingPath(newPathCrude);
    await fsPromises.rename(path, newPath);
    return newPath;
  }

  async moveFiles(
    sourcePaths: string[],
    targetDirPath: string,
  ): Promise<string[]> {
    const tasks = sourcePaths.map(async (sourcePath) => {
      const filename = pathLib.basename(sourcePath);
      const targetPathCrude = pathLib.join(targetDirPath, filename);
      const targetPath = await this.getNonConflictingPath(targetPathCrude);
      await fsPromises.rename(sourcePath, targetPath);
      return targetPath;
    });
    const resultPaths = await Promise.all(tasks);
    return resultPaths;
  }

  async copyFiles(
    sourcePaths: string[],
    targetDirPath: string,
  ): Promise<string[]> {
    const tasks = sourcePaths.map(async (sourcePath) => {
      const filename = pathLib.basename(sourcePath);
      const targetPathCrude = pathLib.join(targetDirPath, filename);
      const targetPath = await this.getNonConflictingPath(targetPathCrude);
      await fsPromises.copyFile(sourcePath, targetPath);
      return targetPath;
    });
    const resultPaths = await Promise.all(tasks);
    return resultPaths;
  }

  private getFileType(stats: fs.Stats): FileType {
    return stats.isFile()
      ? FileType.File
      : stats.isDirectory()
      ? FileType.Directory
      : stats.isSocket()
      ? FileType.Socket
      : FileType.Other;
  }

  private async getDirectorySize(path: string): Promise<number> {
    const filenames = await fsPromises.readdir(path);
    const paths = filenames.map((name) => pathLib.join(path, name));
    let total = 0;
    await Promise.all(
      paths.map(async (path) => {
        try {
          const stats = await fsPromises.stat(path);
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
    const result = await fsPromises.realpath(path);
    return result == path ? null : result;
  }

  private async getNonConflictingPath(path: string): Promise<string> {
    if (!(await this.existsPath(path))) return path;
    const dirname = pathLib.dirname(path);
    const extname = pathLib.extname(path);
    const filename = pathLib.basename(path, extname);
    const pathNew = pathLib.join(dirname, `${filename}_${extname}`);
    return this.getNonConflictingPath(pathNew);
  }

  private async existsPath(path: string): Promise<boolean> {
    return fsPromises
      .stat(path)
      .then(() => true)
      .catch(() => false);
  }

  private formatSize(size: number): string {
    return formatSize(size, { base: 2, standard: 'jedec' });
  }
}
