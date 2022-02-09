import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  @Input()
  set path(value: string) {
    this.items = this.parsePath(value);
  }

  items: FileTableNavigationItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  navigate(path: string): void {
    this.router.navigate([{ path }], { relativeTo: this.route });
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
}
