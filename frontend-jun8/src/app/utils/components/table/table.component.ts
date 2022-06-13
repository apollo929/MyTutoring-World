import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IColumns } from '../../interface';
@Component({
  selector: 'app-table',
  templateUrl: './table.html'
})
export class TableComponent implements OnInit {
  @Input() dataSource: Object[];
  @Input() columns: IColumns[];
  @Input() loading: boolean;
  @Output() onSort = new EventEmitter();
  @Input() sortOption: { [key: string]: string };
  public keys: string[];
  constructor() {}

  ngOnInit() {}

  onSortTable(evt) {
    this.onSort.emit(this.sortOption);
  }
}
