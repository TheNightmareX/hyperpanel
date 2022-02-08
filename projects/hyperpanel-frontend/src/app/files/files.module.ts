import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  FileTextOutline,
  FolderOpenOutline,
} from '@ant-design/icons-angular/icons';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';

import { FileTableComponent } from './file-table/file-table.component';
import { FileTableMenuComponent } from './file-table-menu/file-table-menu.component';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

const icons: IconDefinition[] = [FileTextOutline, FolderOpenOutline];

@NgModule({
  declarations: [FilesComponent, FileTableComponent, FileTableMenuComponent],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NzIconModule.forChild(icons),
    NzCardModule,
    NzTableModule,
    NzPaginationModule,
    NzDropDownModule,
  ],
})
export class FilesModule {}
