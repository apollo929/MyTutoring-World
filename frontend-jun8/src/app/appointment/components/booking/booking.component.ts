import { DTSService } from './../../../shared/services/dts.service';
import { IMyCategory, IMySubject, IMyTopic } from './../../../user/interface';
import { MySubjectService } from './../../../shared/services/my-subject.service';
import { CouponService } from './../../../shared/services/coupon.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../services/appointment.service';
import {
  UtilService,
  AuthService,
  LanguageService,
  WebinarService,
  MyCategoryService,
  MyTopicService
} from '../../../shared/services';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../components';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { FavoriteService } from '../../../shared/services';
import { IUser, ISubject } from '../../../user/interface';
import { IBooking } from '../../interface';
import { ICoupon } from '../../../webinar/interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './booking.html'
})
export class BookingComponent implements OnInit {
  public tutor: IUser = {};
  public booking: IBooking = {
    startTime: '',
    toTime: '',
    tutorId: '',
    targetId: '',
    redirectSuccessUrl: '',
    cancelUrl: '',
    isFree: false,
    couponCode: '',
  };
  public bookinglist: any = [];
  public timeSelectedList: any = [];
  public zipCode: any;
  public timeSelected: any;
  public submitted: boolean = false;
  public loading: boolean = false;
  public subject: IMySubject = null;
  public isLoggedin: boolean = false;
  public showMore: boolean = false;
  public showChar: number = 500;
  // tslint:disable-next-line:max-line-length
  public urlYoutube: any;
  public languages: any;
  public languageNames: any = [];
  public objectLanguage: any = {};

  public maxFreeSlotToBook: number;
  public salePrice: number = 0;
  public coupon: ICoupon;
  public saleValue: any;
  public usedCoupon: boolean = false;
  public appliedCoupon: boolean = false;
  public couponCode: any = '';
  public optionsCoupon: any = {
    tutorId: '',
    targetType: 'subject',
    couponId: '',
    topicId: ''
  };

  public price: number;

  public webinarOptions = {
    webinars: [],
    currentPage: 1,
    pageSize: 6,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'asc'
    },
    count: 0
  };
  public config: any;

  public myCategories: IMyCategory[] = [];
  public mySubjects: IMySubject[] = [];
  public myTopics: IMyTopic[] = [];
  public filterMyCategory: any = {
    currentPage: 1,
    pageSize: 10,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'desc'
    },
    total: 0,
    loading: false
  };

  public filterMySubject: any = {
    currentPage: 1,
    pageSize: 10,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'desc'
    },
    myCategoryId: '',
    total: 0,
    loading: false
  };

  public filterMyTopic: any = {
    currentPage: 1,
    pageSize: 10,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'desc'
    },
    myCategoryId: '',
    mySubjectId: '',
    total: 0,
    loading: false
  };

  public selectedCategoryId: string = '';
  public selectedSubjectId: string = '';

  public topic: IMyTopic = null;
  constructor(
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private appointmentService: AppointmentService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
    private webinarService: WebinarService,
    private tutorFavoriteService: FavoriteService,
    private couponService: CouponService,
    private mySubjectService: MySubjectService,
    private myCategoryService: MyCategoryService,
    private myTopicService: MyTopicService,
    private translate: TranslateService,
    private dtsService: DTSService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.isFree) {
        if (params.isFree == 'true') {
          this.booking.isFree = true;
        }
      }
    });
    this.config = this.route.snapshot.data['appConfig'];
    this.maxFreeSlotToBook = this.config.maxFreeSlotToBook;
    this.tutor = this.route.snapshot.data.tutor;
    this.price = this.tutor.price1On1Class;
    this.booking.tutorId = this.tutor._id;
    this.isLoggedin = this.authService.isLoggedin();
    this.urlYoutube = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.tutor.idYoutube}`
    );
    this.languages = this.languageService.getLang();
    this.objectLanguage = this.languageService.languages;
    if (this.tutor.languages) {
      this.mapLanguageName(this.tutor.languages);
    }
    if (this.tutor) {
      this.queryWebinar();
      this.salePrice = this.tutor.price1On1Class;
      this.queryMyCategories();
    }

    this.optionsCoupon.tutorId = this.tutor._id;
    this.getCurrentCoupon();
    if (this.tutor && this.tutor.bio && this.tutor.bio.length > this.showChar) {
      this.showMore = true;
    }
  }

  chooseSlot(time: any) {
    if (!this.isLoggedin) {
      return this.toasty.error(this.translate.instant('Please login to booking'));
    }
    this.timeSelected = {
      startTime: time.start,
      toTime: time.end
    };
    
    if (time.extendedProps.isDST) {
      this.timeSelected.startTime = time.extendedProps.item.startTime;
      this.timeSelected.toTime = time.extendedProps.item.toTime;
    }
    this.appointmentService
      .checkOverlap({ startTime: this.timeSelected.startTime, toTime: this.timeSelected.toTime })
      .then(resp => {
        if (!resp.data.checkOverlap) {
          if (window.confirm('This slot is overlap with your booked slot. Still book it?')) {
            this.booking.startTime = this.timeSelected.startTime;
            this.booking.toTime = this.timeSelected.toTime;
            this.bookingAppointment(time);
          }
        } else {
          this.booking.startTime = this.timeSelected.startTime;
          this.booking.toTime = this.timeSelected.toTime;
          this.bookingAppointment(time);
        }
      })
      .catch(e => {
        this.toasty.error(this.translate.instant(e.data.data.message || 'Something went wrong, please try again!'));
      });
  }
  
  multiplebookingAppointment() {

    const modalStripe = this.modalService.open(ConfirmModalComponent, {
      size: 'lg'
    });
    modalStripe.componentInstance.subject = this.subject;
    modalStripe.componentInstance.tutor = this.tutor;
    modalStripe.componentInstance.slot = this.timeSelected;
    modalStripe.componentInstance.timeSelList = this.timeSelectedList;
    modalStripe.componentInstance.price = this.booking.isFree ? 0 : this.appliedCoupon ? this.salePrice : this.price;
    modalStripe.componentInstance.price *= this.bookinglist.length;
    modalStripe.componentInstance.config = this.config;
    modalStripe.componentInstance.appliedCoupon = this.appliedCoupon;
    
    modalStripe.result.then(
      result => {
        if (result.confirmed) {
          this.bookinglist.forEach(bookingItem => {
            if (bookingItem.isFree) {
              this.appointmentService.checkFree({ tutorId: bookingItem.tutorId }).then(resp => {
                if (resp.data.canBookFree === true && resp.data.canBookFreeWithTutor) {
                  this.appointmentService
                    .create(bookingItem)
                    .then(() => {
                      this.toasty.success(this.translate.instant('Booking successfully!'));
                      this.submitted = false;
                      return this.router.navigate(['/users/lessons']);
                    })
                    .catch(err => {
                      this.submitted = false;
                      this.router.navigate(['/payments/cancel']);
                      this.toasty.error(this.translate.instant(err.data.message));
                    });
                } else {
                  if (resp.data.canBookFree === false) {
                    this.submitted = false;
                    return this.toasty.error(
                      this.translate.instant('You have taken for the maximum number of free trial classes')
                    );
                  }
                  if (resp.data.canBookFreeWithTutor === false) {
                    this.submitted = false;
                    return this.toasty.error(
                      this.translate.instant('You have taken a free trial class of this tutor before')
                    );
                  }
                }
              });
            } else if (this.salePrice <= 0 && this.appliedCoupon) {
              this.appointmentService
                .create(bookingItem)
                .then(() => {
                  this.toasty.success(this.translate.instant('Booking successfully!'));
                  this.submitted = false;
                  return this.router.navigate(['/users/lessons']);
                })
                .catch(err => {
                  this.submitted = false;
                  this.router.navigate(['/payments/cancel']);
                  this.toasty.error(this.translate.instant(err.data.message));
                });
            } else {
              localStorage.setItem('paymentParams', JSON.stringify(bookingItem));
              this.submitted = false;
              return this.router.navigate(['/payments/pay'], {
                queryParams: {
                  type: 'booking',
                  targetType: 'subject',
                  targetName: this.subject.name,
                  tutorName: this.tutor.name
                },
                state: bookingItem
              });
            }
          });
        } else {
          this.submitted = false;
          return;
        }
      },
      () => {}
    );
  }

  bookingAppointment(timeSlot) {
    if (!this.isLoggedin) {
      return this.toasty.error(this.translate.instant('Please login to booking'));
    }
    this.submitted = true;
    if (this.booking.targetId === '' || this.booking.subjectId === null) {
      this.toasty.error(this.translate.instant('Please choose subject'));
      this.submitted = false;
      this.loading = false;
      return;
    }
    if (this.booking.startTime === '') {
      this.toasty.error(this.translate.instant('Please choose one slot'));
      this.submitted = false;
      this.loading = false;
      return;
    }
    this.booking.redirectSuccessUrl = window.appConfig.url + this.router.url + '/success';
    this.booking.cancelUrl = window.appConfig.url + this.router.url + '/cancel';
    // this.booking.isFree = false;
    if (!this.usedCoupon && this.coupon && this.coupon._id && this.appliedCoupon) {
      this.booking.couponCode = this.coupon.code;
    }
    
    if (timeSlot.backgroundColor == '#0d3c18') {
      const bookingTemp = Object.assign({}, this.booking);
      this.bookinglist.push(bookingTemp);
      console.log(this.bookinglist);
      const timeSelectedTemp = Object.assign({}, this.timeSelected);
      this.timeSelectedList.push(timeSelectedTemp);
    } else {
      this.bookinglist.splice(this.bookinglist.findIndex(x => x == this.booking), 1);
      this.timeSelectedList.splice(this.timeSelectedList.findIndex(x => x == this.timeSelected), 1);
    }
  }

  mapLanguageName(languageKeys: any) {
    languageKeys.forEach(key => {
      this.languageNames.push(this.objectLanguage[key]);
    });
  }

  changeTopic() {
    this.topic = this.myTopics.find(item => item._id === this.booking.targetId);
    if (this.topic) {
      this.price = this.topic.price;
      this.optionsCoupon.topicId = this.topic._id;
    }
  }

  queryWebinar() {
    let params = Object.assign({
      page: this.webinarOptions.currentPage,
      take: this.webinarOptions.pageSize,
      sort: `${this.webinarOptions.sortOption.sortBy}`,
      sortType: `${this.webinarOptions.sortOption.sortType}`,
      isOpen: true,
      tutorId: this.tutor._id || ''
    });
    this.webinarService
      .search(params)
      .then(resp => {
        this.webinarOptions.count = resp.data.count;
        this.webinarOptions.webinars = resp.data.items;
      })
      .catch(() => alert(this.translate.instant('Something went wrong, please try again!')));
  }

  favorite() {
    if (!this.isLoggedin) this.toasty.error(this.translate.instant('Please login to use this feature!'));
    else {
      let params = Object.assign(
        {
          tutorId: this.tutor._id,
          type: 'tutor'
        },
        {}
      );
      this.tutorFavoriteService
        .favorite(params, 'tutor')
        .then(res => {
          this.tutor.isFavorite = true;
          this.toasty.success(this.translate.instant('Added to your favorite tutor list successfully!'));
        })
        .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }

  unFavorite() {
    if (!this.isLoggedin) this.toasty.error(this.translate.instant('Please loggin to use this feature!'));
    else {
      this.tutorFavoriteService
        .unFavorite(this.tutor._id, 'tutor')
        .then(res => {
          this.tutor.isFavorite = false;
          this.toasty.success(this.translate.instant('Deleted from your favorite tutor list successfully!'));
        })
        .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }

  fundTransfer() {
    this.router.navigate(['/tutors/zipCode'], {
      queryParams: { zipCode: this.zipCode }
    });
  }

  checkUsedCoupon(used: boolean) {
    this.usedCoupon = used;
  }

  applyCoupon(event: { appliedCoupon: boolean; code: string }) {
    this.appliedCoupon = event.appliedCoupon;
    if (this.appliedCoupon && this.coupon && this.authService.isLoggedin()) {
      if (this.coupon.type === 'percent') {
        this.saleValue = this.coupon.value;
        this.salePrice = this.price - this.price * (this.saleValue / 100);
      } else if (this.coupon.type === 'money') {
        this.saleValue = this.coupon.value;
        this.salePrice = this.price - this.saleValue;
      }
    } else {
      this.salePrice = this.price || 0;
    }
  }

  getCurrentCoupon() {
    this.couponService
      .getCurrentCoupon({
        targetType: this.optionsCoupon.targetType,
        tutorId: this.optionsCoupon.tutorId
      })
      .then(resp => {
        if (resp && resp.data) {
          this.coupon = resp.data;
          if (this.coupon && this.authService.isLoggedin()) {
            this.optionsCoupon.couponId = this.coupon._id;
          }
        }
      });
  }

  queryMyCategories() {
    this.filterMyCategory.loading = true;
    const params = Object.assign({
      page: this.filterMyCategory.currentPage,
      take: this.filterMyCategory.pageSize,
      sort: `${this.filterMyCategory.sortOption.sortBy}`,
      sortType: `${this.filterMyCategory.sortOption.sortType}`,
      tutorId: this.tutor._id
    });
    this.myCategoryService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMyCategory.total = resp.data.count;
          this.myCategories = resp.data.items;
        }
        this.filterMyCategory.loading = false;
      })
      .catch(err => {
        this.filterMyCategory.loading = false;
        return this.toasty.error(
          this.translate.instant(
            err.data && err.data.data && err.data.data.message
              ? err.data.data.message
              : 'Something went wrong, please try again!'
          )
        );
      });
  }

  selectMyCategory() {
    this.filterMySubject.myCategoryId = this.selectedCategoryId;
    this.mySubjects = [];
    this.myTopics = [];
    this.booking.targetId = '';
    this.selectedSubjectId = '';
    this.booking.targetId = '';
    if (this.selectedCategoryId) {
      this.queryMySubjects();
    }
  }

  queryMySubjects() {
    this.filterMySubject.loading = true;
    const params = Object.assign({
      page: this.filterMySubject.currentPage,
      take: this.filterMySubject.pageSize,
      sort: `${this.filterMySubject.sortOption.sortBy}`,
      sortType: `${this.filterMySubject.sortOption.sortType}`,
      myCategoryId: this.filterMySubject.myCategoryId,
      tutorId: this.tutor._id
    });
    this.mySubjectService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMySubject.total = resp.data.count;
          this.mySubjects = resp.data.items;
        }
        this.filterMySubject.loading = false;
      })
      .catch(err => {
        this.filterMySubject.loading = false;
        return this.toasty.error(
          this.translate.instant(
            err.data && err.data.data && err.data.data.message
              ? err.data.data.message
              : 'Something went wrong, please try again!'
          )
        );
      });
  }

  selectMySubject() {
    this.filterMyTopic.mySubjectId = this.selectedSubjectId;
    this.filterMyTopic.myCategoryId = this.selectedCategoryId;
    this.myTopics = [];
    this.booking.targetId = '';
    if (this.selectedSubjectId && this.selectedCategoryId) {
      this.queryMyTopics();
      this.subject = this.mySubjects.find(item => item._id === this.selectedSubjectId);
    }
  }

  queryMyTopics() {
    this.filterMyTopic.loading = true;
    const params = Object.assign({
      page: this.filterMyTopic.currentPage,
      take: this.filterMyTopic.pageSize,
      sort: `${this.filterMyTopic.sortOption.sortBy}`,
      sortType: `${this.filterMyTopic.sortOption.sortType}`,
      mySubjectId: this.filterMyTopic.mySubjectId,
      myCategoryId: this.filterMyTopic.myCategoryId,
      tutorId: this.tutor._id
    });
    this.myTopicService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMyTopic.total = resp.data.count;
          this.myTopics = resp.data.items;
        }
        this.filterMyTopic.loading = false;
      })
      .catch(err => {
        this.filterMyTopic.loading = false;
        return this.toasty.error(
          this.translate.instant(
            err.data && err.data.data && err.data.data.message
              ? err.data.data.message
              : 'Something went wrong, please try again!'
          )
        );
      });
  }
}
