import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface SelectionColumnsData<T> {
  /** Set the flex-basis percentage of the column. Must be lesser or equal than 1. */
  flexBasis: number;
  /** Set the column name to be displayed as column header. */
  name: string;
  /** Set the column property on the passed model to be displayed as table cell. */
  property: Extract<keyof T, string>;
}

@Component({
  selector: 'afs-custom-table',
  styleUrls: ['./custom-table.component.scss'],
  templateUrl: 'custom-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTableComponent<T> implements OnChanges {
  @Input() data: T[] = [];
  @Input() tableCols: SelectionColumnsData<T>[] = [];

  displayedColumns: string[];
  dataSource;

  constructor() {}

  ngOnChanges() {
    this.displayedColumns = this.tableCols.map((c) => c.property);
    this.dataSource = new MatTableDataSource<T>([...this.data]);
  }
}
