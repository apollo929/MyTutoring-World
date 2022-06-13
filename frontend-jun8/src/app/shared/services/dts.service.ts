import { Injectable } from '@angular/core';

import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class DTSService {
  constructor() {}

  formatToDST(date, timezone = '') {
    let result = timezone ? momentTimeZone(date).add(1, 'hour').tz(timezone) : moment(date).add(1, 'hour');

    return result;
  }
  formatFromDST(date, timezone = '') {
    let result = timezone ? momentTimeZone(date).subtract(1, 'hour').tz(timezone) : moment(date).subtract(1, 'hour');

    return result;
  }

  isDTS(date, timezone = '') {
    const isDTS = timezone ? momentTimeZone.tz(date, timezone).isDST() : moment(date).isDST();
    return isDTS;
  }
}
