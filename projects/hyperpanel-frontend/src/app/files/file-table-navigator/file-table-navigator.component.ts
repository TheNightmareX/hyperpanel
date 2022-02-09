import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface FileTableNavigatorItem {
  segment: string;
  path: string;
}

@Component({
  selector: 'app-file-table-navigator',
  templateUrl: './file-table-navigator.component.html',
  styleUrls: ['./file-table-navigator.component.less'],
})
export class FileTableNavigatorComponent implements OnInit {
  @Input()
  set path(value: string) {
    this.items = this.parsePath(value);
  }

  items: FileTableNavigatorItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  navigate(path: string): void {
    this.router.navigate([{ path }], { relativeTo: this.route });
  }

  parsePath(path: string): FileTableNavigatorItem[] {
    const segments = path.split('/').filter((v) => !!v);
    return [
      ...segments.map((segment, index) => ({
        segment,
        path: '/' + segments.slice(0, index + 1).join('/'),
      })),
    ];
  }
}
