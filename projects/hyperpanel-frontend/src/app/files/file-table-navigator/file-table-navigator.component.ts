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
    const segments = value.split('/').filter((v) => !!v);
    this.items = [
      ...segments.map((segment, index) => ({
        segment,
        path: '/' + segments.slice(0, index + 1).join('/'),
      })),
    ];
  }

  items: FileTableNavigatorItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  navigate(path: string): void {
    this.router.navigate([{ path }], { relativeTo: this.route });
  }
}
