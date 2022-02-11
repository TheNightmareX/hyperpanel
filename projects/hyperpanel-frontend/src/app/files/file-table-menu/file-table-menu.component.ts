import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { FileType } from 'src/app/graphql';

import {
  FileTableComponent,
  FileTableItem,
} from '../file-table/file-table.component';
import { FilesService } from '../files.service';

export interface FileTableMenuItem {
  text: string;
  icon?: string;
  handler: () => void;
}

@Component({
  selector: 'app-file-table-menu',
  templateUrl: './file-table-menu.component.html',
  styleUrls: ['./file-table-menu.component.less'],
})
export class FileTableMenuComponent implements OnInit {
  items: FileTableMenuItem[] = [];

  @ViewChild(NzDropdownMenuComponent)
  private menu!: NzDropdownMenuComponent;

  constructor(
    private table: FileTableComponent,
    private menuService: NzContextMenuService,
    private filesService: FilesService,
  ) {}

  ngOnInit(): void {}

  open(event: MouseEvent): void {
    this.menuService.create(event, this.menu);
    this.items = this.generateItems(this.table.itemsChecked);
  }

  private generateItems(targets: Set<FileTableItem>): FileTableMenuItem[] {
    if (!targets.size) {
      // nothing selected
      return [];
    } else if (targets.size == 1) {
      // one item selected
      const target = targets.values().next().value;

      const itemOpen: FileTableMenuItem = {
        text: 'Open',
        icon: 'select',
        handler: () => this.table.openItem(target),
      };
      const itemDownload: FileTableMenuItem = {
        text: 'Download',
        icon: 'download',
        handler: () =>
          this.filesService.save(target.path, target.name, target.size),
      };

      return target.type == FileType.Directory
        ? [itemOpen]
        : [itemOpen, itemDownload];
    } else {
      // multiple items selected
      return [];
    }
  }
}
