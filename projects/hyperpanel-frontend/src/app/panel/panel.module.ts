import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PanelComponent } from './panel.component';
import { PanelRoutingModule } from './panel-routing.module';

@NgModule({
  declarations: [PanelComponent],
  imports: [CommonModule, PanelRoutingModule],
})
export class PanelModule {}
