import { Component, OnInit } from '@angular/core';

import { FileTableNavigator } from '../file-table/file-table-navigator.service';

interface FileTableNavigationItem {
  segment: string;
  path: string;
}

@Component({
  selector: 'app-file-table-navigation',
  templateUrl: './file-table-navigation.component.html',
  styleUrls: ['./file-table-navigation.component.less'],
})
export class FileTableNavigationComponent implements OnInit {
  items: FileTableNavigationItem[] = [];
  editorVisible = false;
  editorValue = '';

  constructor(public navigator: FileTableNavigator) {}

  ngOnInit(): void {
    this.navigator.path$.subscribe((path) => {
      this.items = this.parsePath(path);
    });
  }

  parsePath(path: string): FileTableNavigationItem[] {
    const segments = path.split('/').filter((v) => !!v);
    return [
      ...segments.map((segment, index) => ({
        segment,
        path: '/' + segments.slice(0, index + 1).join('/'),
      })),
    ];
  }

  openEditor(): void {
    const path = this.navigator.histories[this.navigator.position];
    this.editorValue = path;
    this.editorVisible = true;
  }

  closeEditor(): void {
    this.editorVisible = false;
    if (this.editorValue) this.navigator.navigate(this.editorValue);
  }
}
