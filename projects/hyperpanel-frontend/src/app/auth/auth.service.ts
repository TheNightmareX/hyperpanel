import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { filter, from, map, Observable, tap } from 'rxjs';

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

  constructor(private apollo: Apollo, private authorizeGql: AuthorizeGQL) {}

  login(username: string, password: string): Observable<string> {
    return this.authorizeGql.mutate({ username, password }).pipe(
      map((result) => result.data?.authorize),
      filter((token): token is string => !!token),
      tap((token) => this.token.next(token).save()),
    );
  }

  logout(): Observable<void> {
    return from(this.apollo.client.clearStore()).pipe(
      map(() => {}),
      tap(() => this.token.next(null).save()),
    );
  }
}
