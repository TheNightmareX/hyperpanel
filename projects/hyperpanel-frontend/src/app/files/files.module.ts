import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';

import { FileTableComponent } from './file-table/file-table.component';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

@NgModule({
  declarations: [FilesComponent, FileTableComponent],
  imports: [CommonModule, FilesRoutingModule, NzCardModule],
})
export class FilesModule {}
