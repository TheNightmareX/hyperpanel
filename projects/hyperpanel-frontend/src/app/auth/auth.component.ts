import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthorizeGQL } from '../graphql';

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
    private authorizeGql: AuthorizeGQL,
  ) {}

  ngOnInit(): void {}

  async login(username: string, password: string): Promise<void> {
    this.authorizeGql.mutate({ username, password }).subscribe({
      next: () => this.messageService.success('Login succeeded'),
      error: () => this.messageService.error('Login failed'),
    });
  }
}
