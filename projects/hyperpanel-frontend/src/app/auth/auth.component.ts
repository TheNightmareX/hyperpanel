import { Component, OnInit } from '@angular/core';

import { AuthorizationGQL } from '../graphql';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements OnInit {
  data = {
    username: '',
    password: '',
  };

  constructor(private authGql: AuthorizationGQL) {}

  ngOnInit(): void {}

  async login(username: string, password: string): Promise<void> {
    this.authGql.fetch({ username, password }).subscribe();
  }
}
