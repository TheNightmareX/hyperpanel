import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';

import {
  FileTableComponent,
  FileTableItem,
} from '../file-table/file-table.component';

@Component({
  selector: 'app-file-table-menu',
  templateUrl: './file-table-menu.component.html',
  styleUrls: ['./file-table-menu.component.less'],
})
export class FileTableMenuComponent implements OnInit {
  @Input() targets = new Set<FileTableItem>();

  get target(): FileTableItem {
    return this.targets.values().next().value;
  }

  @ViewChild(NzDropdownMenuComponent)
  private menu!: NzDropdownMenuComponent;

  constructor(
    private table: FileTableComponent,
    private menuService: NzContextMenuService,
  ) {}

  ngOnInit(): void {}

  open(event: MouseEvent): void {
    this.menuService.create(event, this.menu);
  }

  openTarget(): void {
    this.table.openItem(this.target);
  }
}
