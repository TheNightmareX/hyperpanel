import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';

import { FileTableComponent } from './file-table/file-table.component';
import { FileTableMenuComponent } from './file-table-menu/file-table-menu.component';
import { FileTableRowComponent } from './file-table-row/file-table-row.component';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

@NgModule({
  declarations: [
    FilesComponent,
    FileTableComponent,
    FileTableRowComponent,
    FileTableMenuComponent,
  ],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NzCardModule,
    NzTableModule,
    NzPaginationModule,
    NzDropDownModule,
  ],
})
export class FilesModule {}
