import { Component, OnInit } from '@angular/core';
import { CouponService } from '../coupon.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TutorService } from '../../tutor/tutor.service';
import { WebinarService } from '../../webinar/webinar.service';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  templateUrl: '../form.html'
})
export class CouponCreateComponent implements OnInit {
  public coupon: any = {
    name: '',
    code: '',
    type: 'percent',
    value: 0,
    webinarId: null,
    tutorId: '',
    courseId: null,
    expiredDate: '',
    active: true,
    startTime: '',
    limitNumberOfUse: 0,
    targetType: ''
  };
  public isSubmitted: Boolean = false;
  public searching = false;
  public searchFailed = false;
  public webinars: any = [];
  public courses: any[] = [];
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
  public tutor: any;
  search = (text$: Observable<String>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.tutorService
          .search({ name: term })
          .then(resp => {
            this.searchFailed = false;
            this.searching = false;
            return resp.data.items;
          })
          .catch(err => {
            this.searchFailed = true;
            this.searching = false;
            return of([]);
          })
      ),
      tap(() => (this.searching = false))
      // tslint:disable-next-line:semicolon
    );
  formatter = (x: { name: String }) => x.name;

  constructor(
    private router: Router,
    private couponService: CouponService,
    private toasty: ToastrService,
    private tutorService: TutorService,
    private webinarService: WebinarService
  ) {}

  ngOnInit() {}

  selectTutor(event) {
    this.coupon.tutorId = event.item._id;
    if (this.coupon.targetType === 'webinar') {
      this.queryWebinar();
    }
  }

  queryWebinar() {
    this.webinarService
      .search({
        take: 100,
        tutorId: this.coupon.tutorId
      })
      .then(resp => {
        this.webinars = resp.data.items;
        this.coupon.webinarId = this.webinars.length > 0 ? this.webinars[0]._id : null;
        if (this.coupon.targetType == 'webinar' && ((this.webinars && this.webinars.length === 0) || !this.webinars)) {
          return this.toasty.error('Tutor does not have webinars');
        }
      })
      .catch(e => this.toasty.error('Something went wrong, please try again!'));
  }

  selectDate(event, field) {
    const date = `${event.year}-${event.month}-${event.day}`;
    if (moment().subtract(1, 'days').isAfter(moment(date, 'YYYY/MM/DD'))) {
      this.time[field] = {
        year: 0,
        month: 0,
        day: 0
      };
      this.coupon[field] = '';
      return this.toasty.error('Please select an expiration date greater than or equal to the current date');
    }
    this.coupon[field] = new Date(date).toString();
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
      return this.toasty.error('The expiration date must be greater than the start date');
    }
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid || !this.coupon.startTime || !this.coupon.expiredDate) {
      return this.toasty.error('Invalid form, please try again.');
    }
    if (this.coupon.targetType === 'webinar' && (!this.coupon.tutorId || !this.coupon.webinarId)) {
      return this.toasty.error('Please select tutor and webinar.');
    }
    this.couponService.create(this.coupon).then(
      () => {
        this.toasty.success('Coupon has been created');
        this.router.navigate(['/coupons/list']);
      },
      err => this.toasty.error(err.data.data.message || 'Something went wrong!')
    );
  }
}
