import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeoService, AuthService, CouponService } from '../../../../shared/services';
import { IUser } from '../../../../user/interface';
import * as moment from 'moment';
import * as _ from 'lodash';
import { IWebinar } from '../../../../webinar/interface';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon-form.html'
})
export class CouponComponent implements OnInit {
  @Input() tutor: IUser;
  @Input() webinar: IWebinar;
  @Input() targetType: string;
  @Input() coupon: any = {
    name: '',
    code: '',
    type: 'percent',
    value: 0,
    webinarId: null,
    tutorId: '',
    expiredDate: '',
    active: true,
    startTime: '',
    limitNumberOfUse: 0,
    targetType: ''
  };
  public time = {
    startTime: {
      year: 0,
      month: 0,
      day: 0
    },
    expiredDate: {
      year: 0,
      month: 0,
      day: 0
    }
  };
  public isSubmitted: Boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private authService: AuthService,
    private couponService: CouponService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.tutor && this.tutor._id) {
      this.coupon.tutorId = this.tutor._id;
    }
    if (this.webinar && this.webinar._id) {
      this.coupon.webinarId = this.webinar._id;
    }
    if (this.targetType) {
      this.coupon.targetType = this.targetType;
      this.getCurrentCoupon();
    }
  }

  getCurrentCoupon() {
    this.couponService
      .getCurrentCoupon({
        targetType: this.targetType,
        webinarId: this.coupon.webinarId || '',
        tutorId: this.coupon.tutorId || ''
      })
      .then(resp => {
        if (resp && resp.data) {
          this.coupon = resp.data;
          const startTime = new Date(this.coupon.startTime);
          const expiredDate = new Date(this.coupon.expiredDate);
          this.time.startTime = {
            year: startTime.getFullYear(),
            month: startTime.getMonth() === 0 ? 12 : startTime.getMonth() + 1,
            day: startTime.getDate()
          };
          this.time.expiredDate = {
            year: expiredDate.getFullYear(),
            month: expiredDate.getMonth() === 0 ? 12 : expiredDate.getMonth() + 1,
            day: expiredDate.getDate()
          };
        }
      });
  }

  selectDate(event, field) {
    const date = `${event.year}-${event.month}-${event.day}`;
    if (
      moment(date, 'YYYY/MM/DD')
        .add(30, 'second')
        .utc()
        .isBefore(moment().set('hour', 0).set('minute', 0).set('second', 0))
    ) {
      this.time[field] = {
        year: 0,
        month: 0,
        day: 0
      };
      this.coupon[field] = '';
      return this.toasty.error(
        this.translate.instant('Please select an expiration date greater than or equal to the current date')
      );
    }
    this.coupon[field] = new Date(event.year, event.month - 1, event.day).toString();
    if (
      this.coupon.startTime &&
      this.coupon.expiredDate &&
      moment(this.coupon.startTime).isSameOrAfter(moment(this.coupon.expiredDate))
    ) {
      this.time.expiredDate = {
        year: 0,
        month: 0,
        day: 0
      };
      this.coupon.expiredDate = '';
      return this.toasty.error(this.translate.instant('The expiration date must be greater than the start date'));
    } else {
      this.coupon.expiredDate = moment(this.coupon.expiredDate)
        .set('hour', 23)
        .set('minute', 59)
        .set('second', 59)
        .toDate();
    }
  }

  submit(frm) {
    this.isSubmitted = true;
    if (!frm.valid || !this.coupon.startTime || !this.coupon.expiredDate) {
      return this.toasty.error(this.translate.instant('Invalid form, please try again.'));
    }
    if (!this.coupon._id) {
      this.couponService.create(this.coupon).then(
        resp => {
          this.coupon = resp.data;
          this.toasty.success(this.translate.instant('Coupon has been created'));
        },
        err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!'))
      );
    } else {
      const data = _.pick(this.coupon, [
        'name',
        'code',
        'type',
        'value',
        'expiredDate',
        'tutorId',
        'webinarId',
        'active',
        'startTime',
        'limitNumberOfUse',
        'targetType'
      ]);
      this.couponService.update(this.coupon._id, data).then(
        () => {
          this.toasty.success(this.translate.instant('Coupon has been updated'));
        },
        err => this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong!'))
      );
    }
  }
}
