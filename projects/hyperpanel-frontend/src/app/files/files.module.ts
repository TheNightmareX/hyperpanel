import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  ArrowLeftOutline,
  ArrowRightOutline,
  DownloadOutline,
  FileTextOutline,
  FolderOpenOutline,
  HomeOutline,
  SelectOutline,
} from '@ant-design/icons-angular/icons';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';

import { FileTableComponent } from './file-table/file-table.component';
import { FileTableMenuComponent } from './file-table-menu/file-table-menu.component';
import { FileTableNavigationComponent } from './file-table-navigation/file-table-navigation.component';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

const icons: IconDefinition[] = [
  ArrowLeftOutline,
  ArrowRightOutline,
  DownloadOutline,
  FileTextOutline,
  FolderOpenOutline,
  HomeOutline,
  SelectOutline,
];

@NgModule({
  declarations: [
    FilesComponent,
    FileTableComponent,
    FileTableMenuComponent,
    FileTableNavigationComponent,
  ],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NzIconModule.forChild(icons),
    NzMessageModule,
    NzTableModule,
    NzPaginationModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzDividerModule,
  ],
})
export class FilesModule {}
