import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [MatTableModule, MatSnackBarModule],
  exports: [MatSnackBarModule],
})
export class MaterialModule { }
