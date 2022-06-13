import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-sort',
  templateUrl: './sort.html'
})
export class SortComponent implements OnInit {
  @Input() sortOption: { [key: string]: string };
  @Input() sortBy: string;
  @Output() onSort = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  sort(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.onSort.emit(this.sortOption);
  }
}
