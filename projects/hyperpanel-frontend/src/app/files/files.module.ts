import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  FileTextOutline,
  FolderOpenOutline,
  HomeOutline,
} from '@ant-design/icons-angular/icons';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';

import { FileTableComponent } from './file-table/file-table.component';
import { FileTableMenuComponent } from './file-table-menu/file-table-menu.component';
import { FileTableNavigatorComponent } from './file-table-navigator/file-table-navigator.component';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

const icons: IconDefinition[] = [
  FileTextOutline,
  FolderOpenOutline,
  HomeOutline,
];

@NgModule({
  declarations: [
    FilesComponent,
    FileTableComponent,
    FileTableMenuComponent,
    FileTableNavigatorComponent,
  ],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NzIconModule.forChild(icons),
    NzTableModule,
    NzPaginationModule,
    NzDropDownModule,
    NzBreadCrumbModule,
  ],
})
export class FilesModule {}
