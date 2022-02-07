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
      id: this.getFileId(stats),
      name: pathLib.basename(path),
      dirname: pathLib.dirname(path),
      path,
      realpath: await this.getRealpath(path),
      type: this.getFileType(stats),
      size: stats.size,
      sizeFormatted: this.formatSize(stats.size),
      modifiedAt: stats.mtime,
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
    limit: number,
  ): Promise<FileInfoList> {
    const filenames = await fsPromises.readdir(path);
    const filenamesSliced = filenames.slice(offset, offset + limit);
    const filepaths = filenamesSliced.map((filename) =>
      pathLib.join(path, filename),
    );
    const items = await Promise.all(
      filepaths.map((path) => this.getFileInfo(path, false)),
    );
    return { offset, total: filenames.length, items };
  }

  async createFile(path: string): Promise<FileInfo> {
    path = await this.getNonConflictingPath(path);
    const dirPath = pathLib.dirname(path);
    await fsPromises.mkdir(dirPath, { recursive: true });
    await fsPromises.writeFile(path, '');
    return this.getFileInfo(path, false);
  }

  async createDirectory(path: string): Promise<FileInfo> {
    path = await this.getNonConflictingPath(path);
    await fsPromises.mkdir(path, { recursive: true });
    return this.getFileInfo(path, false);
  }

  async renameFile(path: string, newName: string): Promise<FileInfo> {
    const dirPath = pathLib.dirname(path);
    const newPathCrude = pathLib.join(dirPath, newName);
    const newPath = await this.getNonConflictingPath(newPathCrude);
    await fsPromises.rename(path, newPath);
    return this.getFileInfo(path, false);
  }

  async moveFile(sourcePath: string, targetPath: string): Promise<FileInfo> {
    targetPath = await this.getNonConflictingPath(targetPath);
    await fsPromises.rename(sourcePath, targetPath);
    return this.getFileInfo(targetPath, false);
  }

  async copyFile(sourcePath: string, targetPath: string): Promise<FileInfo> {
    targetPath = await this.getNonConflictingPath(targetPath);
    await fsPromises.copyFile(sourcePath, targetPath);
    return this.getFileInfo(targetPath, false);
  }

  async removeFile(path: string): Promise<FileInfo> {
    const fileInfo = await this.getFileInfo(path, false);
    await fsPromises.rm(path, { recursive: true });
    return fileInfo;
  }

  private getFileId(stats: fs.Stats): string {
    return `${stats.dev}:${stats.ino}`;
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
