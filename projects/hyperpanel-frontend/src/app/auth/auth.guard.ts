import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

import { AuthorizedGQL } from '../graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private authorizedGql: AuthorizedGQL) {}

  canLoad():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authorizedGql.fetch().pipe(
      map((result) => result.data.authorized),
      catchError(() => of(this.router.createUrlTree(['/auth']))),
    );
  }
}
