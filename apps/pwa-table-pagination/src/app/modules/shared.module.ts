import { NgModule } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [ComponentsModule, MaterialModule],
  exports: [ComponentsModule, MaterialModule],
})
export class SharedModule { }
