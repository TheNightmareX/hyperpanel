import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDefinition } from '@ant-design/icons-angular';
import { FileOutline } from '@ant-design/icons-angular/icons';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { PanelComponent } from './panel.component';
import { PanelRoutingModule } from './panel-routing.module';

const icons: IconDefinition[] = [FileOutline];

@NgModule({
  declarations: [PanelComponent],
  imports: [
    CommonModule,
    PanelRoutingModule,
    NzIconModule.forChild(icons),
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
  ],
})
export class PanelModule {}
