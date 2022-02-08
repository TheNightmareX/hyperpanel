import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';

import { FileTableComponent } from './file-table/file-table.component';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

@NgModule({
  declarations: [FilesComponent, FileTableComponent],
  imports: [CommonModule, FilesRoutingModule, NzCardModule, NzTableModule],
})
export class FilesModule {}
