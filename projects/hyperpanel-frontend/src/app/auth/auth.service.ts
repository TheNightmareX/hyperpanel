import { Injectable } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

import { AuthorizeGQL } from '../graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authorizeGql: AuthorizeGQL) {}

  login(username: string, password: string): Observable<string> {
    return this.authorizeGql.mutate({ username, password }).pipe(
      map((result) => result.data?.authorize),
      filter((token): token is string => !!token),
    );
  }
}
