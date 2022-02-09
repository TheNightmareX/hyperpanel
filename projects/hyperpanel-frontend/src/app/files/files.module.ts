import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  ArrowLeftOutline,
  ArrowRightOutline,
  FileTextOutline,
  FolderOpenOutline,
  HomeOutline,
} from '@ant-design/icons-angular/icons';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';

import { FileTableComponent } from './file-table/file-table.component';
import { FileTableMenuComponent } from './file-table-menu/file-table-menu.component';
import { FileTableNavigationComponent } from './file-table-navigation/file-table-navigation.component';
import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

const icons: IconDefinition[] = [
  FileTextOutline,
  FolderOpenOutline,
  HomeOutline,
  ArrowLeftOutline,
  ArrowRightOutline,
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
    NzTableModule,
    NzPaginationModule,
    NzDropDownModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzSpaceModule,
  ],
})
export class FilesModule {}
