import { Injectable } from '@nestjs/common';
import { lstat } from 'fs/promises';
import { basename } from 'path';

import { FileStatus } from './entities/file-status.entity';

@Injectable()
export class FilesService {
  async getStatus(path: string): Promise<FileStatus> {
    const stats = await lstat(path);
    if (!stats.isFile()) throw `"${path}" is not a file`;
    return {
      name: basename(path),
      size: stats.size,
      modifiedAt: stats.mtime,
    };
  }
}
