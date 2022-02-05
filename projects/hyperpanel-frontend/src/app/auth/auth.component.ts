import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from './auth.service';

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
    private router: Router,
    private messageService: NzMessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.logout().subscribe();
  }

  async login(username: string, password: string): Promise<void> {
    this.authService.login(username, password).subscribe({
      next: () => {
        this.messageService.success('Login succeeded');
        this.router.navigate(['/panel']);
      },
      error: () => {
        this.messageService.error('Login failed');
      },
    });
  }
}
