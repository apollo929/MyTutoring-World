import { DTSService } from './../../shared/services/dts.service';
import { AuthService } from './../../shared/services/auth.service';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dstFormat'
})
export class DSTFormatPipe implements PipeTransform {
  public userTimeZone = '';
  public dstTime = '';
  constructor(private dts: DTSService) {}
  transform(value: string): any {
    this.userTimeZone = localStorage.getItem('timeZone') || '';
    if (this.userTimeZone && this.dts.isDTS(moment(value).toDate(), this.userTimeZone)) {
      return this.dts.formatToDST(value).toISOString();
    } else return value;
  }
}
