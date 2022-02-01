import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';
import { FilesResolver } from './files.resolver';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesResolver, FilesService],
})
export class FilesModule {}
