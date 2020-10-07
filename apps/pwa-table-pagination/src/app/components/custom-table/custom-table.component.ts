import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';

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
export class CustomTableComponent<T> implements OnInit {
  @Input() data: T[] = [];
  @Input() tableCols: SelectionColumnsData<T>[] = [];

  displayedColumns: string[];
  dataSource = new MatTableDataSource<T>([]);

  constructor() {}

  ngOnInit() {
    this.displayedColumns = this.tableCols.map(c => c.property);
    this.dataSource.data = [...this.data];
  }
}
