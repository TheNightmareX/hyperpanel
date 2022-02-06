import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

interface FileError extends Error {
  errno: number;
  code: FileErrorCode;
  syscall: string;
  path: string;
  dest?: string;
}

enum FileErrorCode {
  ENOENT = 'ENOENT',
  EACCES = 'EACCES',
  ENOTDIR = 'ENOTDIR',
}

function isFileError(error: Error): error is FileError {
  const err = error as FileError;
  return err.code in FileErrorCode;
}

@Catch(Error)
export class FilesErrorFilter<T extends Error | FileError>
  implements ExceptionFilter<T>
{
  catch(exception: T): void {
    if (!isFileError(exception)) return;

    if (exception.code == FileErrorCode.EACCES)
      throw new BadRequestException(`"${exception.path}" must be accessible`);
    if (exception.code == FileErrorCode.ENOENT)
      throw new BadRequestException(`"${exception.path}" must exist`);
    if (exception.code == FileErrorCode.ENOTDIR)
      throw new BadRequestException(`"${exception.path}" must be a directory`);
  }
}
