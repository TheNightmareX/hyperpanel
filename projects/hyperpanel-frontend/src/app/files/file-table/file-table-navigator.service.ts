import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

// TODO: catch user's browser-level forwards and backwards and sync with our
// history.

@Injectable()
export class FileTableNavigator {
  path$: Observable<string>;
  histories: string[] = ['/'];
  position = 0;

  get canForward(): boolean {
    return this.position < this.histories.length - 1;
  }

  get canBackward(): boolean {
    return this.position > 0;
  }

  constructor(private router: Router, private route: ActivatedRoute) {
    this.path$ = this.route.params.pipe(map((params) => params['path'] ?? '/'));
  }

  navigate(path: string): void {
    if (path == this.histories[this.position]) return;
    this.histories.length = ++this.position;
    this.histories[this.position] = path;
    this.router.navigate([{ path }], {
      relativeTo: this.route,
    });
  }

  forward(): void {
    if (!this.canForward) return;
    this.position++;
    history.forward();
  }

  backward(): void {
    if (!this.canBackward) return;
    this.position--;
    history.back();
  }
}
