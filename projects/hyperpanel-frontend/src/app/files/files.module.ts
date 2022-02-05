import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FilesComponent } from './files.component';
import { FilesRoutingModule } from './files-routing.module';

@NgModule({
  declarations: [FilesComponent],
  imports: [CommonModule, FilesRoutingModule],
})
export class FilesModule {}
