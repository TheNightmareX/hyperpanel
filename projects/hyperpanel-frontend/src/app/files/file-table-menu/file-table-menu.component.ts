import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-file-table-menu',
  templateUrl: './file-table-menu.component.html',
  styleUrls: ['./file-table-menu.component.less'],
})
export class FileTableMenuComponent implements OnInit {
  FileType = FileType;

  @Input() targets = new Set<FileTableItem>();

  get target(): FileTableItem | null {
    return this.targets.size == 1 ? this.targets.values().next().value : null;
  }

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
  }

  openTarget(): void {
    if (!this.target) return;
    this.table.openItem(this.target);
  }

  saveTarget(): void {
    if (!this.target) return;
    this.filesService.save(this.target.path, this.target.name);
  }
}
