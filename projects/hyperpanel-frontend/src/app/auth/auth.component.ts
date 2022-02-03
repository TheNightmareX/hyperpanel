import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  constructor(
    private messageService: NzMessageService,
    private authorizationGql: AuthorizationGQL,
  ) {}

  ngOnInit(): void {}

  async login(username: string, password: string): Promise<void> {
    this.authorizationGql.fetch({ username, password }).subscribe(
      () => this.messageService.success('Login succeeded'),
      () => this.messageService.error('Login failed'),
    );
  }
}
