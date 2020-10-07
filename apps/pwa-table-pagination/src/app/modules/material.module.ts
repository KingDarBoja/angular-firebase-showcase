import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [MatTableModule, MatSnackBarModule],
  exports: [MatTableModule, MatSnackBarModule],
})
export class MaterialModule { }
