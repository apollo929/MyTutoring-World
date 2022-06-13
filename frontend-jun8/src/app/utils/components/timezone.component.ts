import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';

import 'moment-range';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/ar';
import 'moment/locale/hi';

@Component({
  selector: 'app-timezone',
  template: `
    <div>
      <form #f="ngForm">
        <div class="form-group">
          <ng-select
            [items]="tzNames"
            appendTo="body"
            name="timezone"
            [multiple]="false"
            [closeOnSelect]="true"
            [(ngModel)]="userTz"
            #language="ngModel"
            (ngModelChange)="timeZoneChanged($event)"
          >
          </ng-select>
        </div>
      </form>
    </div>
  `
})
export class TimezoneComponent implements OnInit {
  @Input() userTz: string = 'Asia/Ho_Chi_Minh';
  @Output() onChange = new EventEmitter();
  public tzNames: string[];
  public selectedTz: string;
  constructor() {
    this.tzNames = moment.tz.names();
  }

  ngOnInit() {
    if (!this.userTz) {
      this.userTz = moment.tz.guess();
      if (this.userTz === 'Asia/Calcutta') {
        this.userTz = 'Asia/Kolkata';
      } else if (this.userTz === 'Asia/Saigon') {
        this.userTz = 'Asia/Ho_Chi_Minh';
      } else {
        this.userTz = this.userTz;
      }
    } else {
      this.userTz = this.userTz;
    }
    this.timeZoneChanged(this.userTz);
  }

  public timeZoneChanged(timeZone: string): void {
    this.userTz = timeZone;
    this.onChange.emit(this.userTz);
  }
}
