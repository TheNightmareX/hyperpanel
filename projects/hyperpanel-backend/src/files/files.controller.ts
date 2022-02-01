import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Controller('files')
export class FilesController {
  @Get('*')
  download(@Param('0') path: string): StreamableFile {
    path = '/' + path;
    const stream = createReadStream(path);
    return new StreamableFile(stream);
  }
}
