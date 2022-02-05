import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';

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

  loading = false;

  constructor(
    private router: Router,
    private messageService: NzMessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.logout().subscribe();
  }

  async login(username: string, password: string): Promise<void> {
    if (this.loading) return;

    this.loading = true;
    this.authService
      .login(username, password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.messageService.success('Login succeeded');
          this.router.navigate(['/panel']);
        },
        error: () => {
          this.messageService.error('Login failed');
          this.data.password = '';
        },
      });
  }
}
