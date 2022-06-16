import { Component, OnInit } from '@angular/core';
import { CouponService } from '../coupon.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TutorService } from '../../tutor/tutor.service';
import { WebinarService } from '../../webinar/webinar.service';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-coupon-update',
  templateUrl: '../form.html'
})
export class CouponUpdateComponent implements OnInit {
  public coupon: any = {};
  public isSubmitted: Boolean = false;
  private couponId: String;
  public searching = false;
  public searchFailed = false;
  public webinars: any = [];
  public courses: any[] = [];
  public tutor: any;
  public webinar: any;
  public time: any = {
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
    private route: ActivatedRoute,
    private tutorService: TutorService,
    private webinarService: WebinarService
  ) {}

  ngOnInit() {
    this.couponId = this.route.snapshot.paramMap.get('id');
    this.couponService.findOne(this.couponId).then(resp => {
      this.tutor = resp.data.tutor;
      this.webinar = resp.data.webinar;
      this.coupon = _.pick(resp.data, [
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
        'targetType',
        'courseId'
      ]);
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
      this.queryWebinar();
    });
  }

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
      })
      .catch(e => this.toasty.error('Something went wrong, please try again!'));
  }

  selectDate(event, field) {
    const date = `${event.year}-${event.month}-${event.day}`;
    if (moment().isAfter(moment(date, 'YYYY/MM/DD'))) {
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
    this.couponService
      .update(this.couponId, this.coupon)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/coupons/list']);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
  }
}
