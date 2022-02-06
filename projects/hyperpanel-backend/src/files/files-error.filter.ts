import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

const fileErrorCode = ['ENOENT', 'EACCES'] as const;

interface FileError extends Error {
  errno: number;
  code: typeof fileErrorCode[number];
  syscall: string;
  path: string;
}

function isFileError(error: Error): error is FileError {
  const err = error as FileError;
  return fileErrorCode.includes(err.code);
}

@Catch(Error)
export class FilesErrorFilter<T extends Error | FileError>
  implements ExceptionFilter<T>
{
  catch(exception: T): void {
    if (!isFileError(exception)) return;

    if (exception.code == 'EACCES')
      throw new BadRequestException(`"${exception.path}" must be accessible`);
    if (exception.code == 'ENOENT')
      throw new BadRequestException(`"${exception.path}" must exist`);
  }
}
