import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable()
export class FileTableNavigator {
  path$: Observable<string>;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.path$ = this.route.params.pipe(map((params) => params['path'] ?? '/'));
  }

  navigate(path: string): void {
    this.router.navigate([{ path }], { relativeTo: this.route });
  }
}
