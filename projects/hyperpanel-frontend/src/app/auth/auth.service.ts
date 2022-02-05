import { Injectable } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';

import { LocalStorageItem } from '../common/local-storage-item.class';
import { AuthorizeGQL } from '../graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = new LocalStorageItem<string | null>(
    'token',
    (v) => typeof v == 'string',
    null,
  );

  constructor(private authorizeGql: AuthorizeGQL) {}

  login(username: string, password: string): Observable<string> {
    return this.authorizeGql.mutate({ username, password }).pipe(
      map((result) => result.data?.authorize),
      filter((token): token is string => !!token),
      tap((token) => this.token.next(token).save()),
    );
  }
}
