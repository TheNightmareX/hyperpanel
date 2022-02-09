import { Component, Input, OnInit } from '@angular/core';

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

  constructor(public table: FileTableComponent) {}

  ngOnInit(): void {}
}
