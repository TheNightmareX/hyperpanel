import { Injectable, Type } from '@nestjs/common';
import formatSize from 'filesize';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as pathLib from 'path';

import { FileInfo, FileInfoPartial } from './entities/file-info.entity';
import {
  FileInfoList,
  FileInfoListItem,
} from './entities/file-info-list.entity';
import { FileType } from './entities/file-type.enum';

@Injectable()
export class FilesService {
  async getFileInfo(path: string, accurate = false): Promise<FileInfo> {
    const stats = await fsPromises.stat(path);

    const info = this.instantiate(FileInfo, {
      id: this.getFileId(stats),
      name: pathLib.basename(path),
      dirname: pathLib.dirname(path),
      path,
      realpath: await this.getRealpath(path),
      type: this.getFileType(stats),
      size: stats.size,
      sizeFormatted: this.formatSize(stats.size),
      modifiedAt: stats.mtime,
    });

    if (info.type == FileType.Directory && accurate) {
      info.size = await this.getDirectorySize(path);
      info.sizeFormatted = this.formatSize(info.size);
    }

    return info;
  }

  async getChildrenFileInfo(
    path: string,
    offset = 0,
    limit = 20,
  ): Promise<FileInfoList> {
    const filenamesAll = await fsPromises.readdir(path);
    const filenames = filenamesAll.slice(offset, offset + limit);
    const filepaths = filenames.map((filename) => pathLib.join(path, filename));
    const tasks: Promise<typeof FileInfoListItem>[] = filepaths.map(
      (path, index) =>
        this.getFileInfo(path).catch(() =>
          this.instantiate(FileInfoPartial, { name: filenames[index] }),
        ),
    );
    const results = await Promise.all(tasks);
    return { offset, total: filenamesAll.length, items: results };
  }

  async createFile(path: string, isDirectory = false): Promise<FileInfo> {
    path = await this.getNonConflictingPath(path);
    if (isDirectory) {
      await fsPromises.mkdir(path, { recursive: true });
    } else {
      const dirPath = pathLib.dirname(path);
      await fsPromises.mkdir(dirPath, { recursive: true });
      await fsPromises.writeFile(path, '');
    }
    return this.getFileInfo(path);
  }

  async renameFile(path: string, newName: string): Promise<FileInfo> {
    const dirPath = pathLib.dirname(path);
    const newPathCrude = pathLib.join(dirPath, newName);
    const newPath = await this.getNonConflictingPath(newPathCrude);
    await fsPromises.rename(path, newPath);
    return this.getFileInfo(path);
  }

  async moveFile(sourcePath: string, targetPath: string): Promise<FileInfo> {
    targetPath = await this.getNonConflictingPath(targetPath);
    await fsPromises.rename(sourcePath, targetPath);
    return this.getFileInfo(targetPath);
  }

  async copyFile(sourcePath: string, targetPath: string): Promise<FileInfo> {
    targetPath = await this.getNonConflictingPath(targetPath);
    await fsPromises.copyFile(sourcePath, targetPath);
    return this.getFileInfo(targetPath);
  }

  async removeFile(path: string): Promise<FileInfo> {
    const fileInfo = await this.getFileInfo(path);
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

  private instantiate<Instance>(
    type: Type<Instance>,
    data: Instance,
  ): Instance {
    const instance = new type();
    Object.assign(instance, data);
    return instance;
  }
}
