import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomTableComponent } from './custom-table/custom-table.component';
import { ScrollableDirective } from '../directives/scrollable.directive';
import { MaterialModule } from '../modules/material.module';

@NgModule({
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [CustomTableComponent, ScrollableDirective],
  declarations: [
    // Components
    CustomTableComponent,
    // Directives
    ScrollableDirective,
  ],
})
export class ComponentsModule {}
