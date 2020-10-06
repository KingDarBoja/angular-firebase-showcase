import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomTableComponent } from './custom-table/custom-table.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [CustomTableComponent],
  declarations: [CustomTableComponent],
})
export class ComponentsModule {}
