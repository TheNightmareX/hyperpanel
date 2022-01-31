import { BadRequestException, Injectable } from '@nestjs/common';
import fileSize from 'filesize';
import { lstat } from 'fs/promises';
import { basename } from 'path';

import { FileStatus } from './entities/file-status.entity';

@Injectable()
export class FilesService {
  async getStatus(path: string): Promise<FileStatus> {
    const stats = await lstat(path).catch(() => {
      throw new BadRequestException(`"${path}" must exist`);
    });
    if (!stats.isFile())
      throw new BadRequestException(`"${path}" must be a file`);
    return {
      name: basename(path),
      size: stats.size,
      sizeFormatted: fileSize(stats.size),
      modifiedAt: stats.mtime,
    };
  }
}
