import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import { LockOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';

const icons: IconDefinition[] = [UserOutline, LockOutline];

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NzIconModule.forChild(icons),
    NzLayoutModule,
    NzTypographyModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzDividerModule,
  ],
})
export class AuthModule {}
