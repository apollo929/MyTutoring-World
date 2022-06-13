import { Component, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
@Component({
  selector: 'date-range',
  templateUrl: './date-range.html'
})
export class DateRangeComponent {
  @Output() dateChange = new EventEmitter();
  isShow: Boolean = false;
  hoveredDate: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate;
  dateRange: any = {};
  outsideDays = 'visible';
  showDates: any = '';
  startDate: any;
  endDate: any;

  constructor(calendar: NgbCalendar) {
    this.fromDate = calendar.getToday();
  }

  toggle() {
    this.isShow = !this.isShow;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      this.startDate = `${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year}`;
      this.endDate = `${this.toDate.day}-${this.toDate.month}-${this.toDate.year}`;
      this.showDates = `${this.startDate} to ${this.endDate}`;
      this.dateRange = {
        from: moment(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day))
          .startOf('day')
          .toDate()
          .toISOString(),
        to: moment(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day))
          .endOf('day')
          .toDate()
          .toISOString()
      };
      this.dateChange.emit(this.dateRange);
      this.isShow = false;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
}
