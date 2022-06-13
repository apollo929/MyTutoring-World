import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../course.service';
import { CalendarService } from '../../calendar/services/calendar.service';
import { AuthService } from '../../shared/services';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StripeModalComponent } from '../stripe/stripe.component';
import { ICourse, ICoupon, ICourseGoal, ICourseSection } from '../interface';
import { IMylesson, IUser } from '../../user/interface';
import { IStatsReview } from '../../reviews/interface';
import * as _ from 'lodash';
import { FavoriteService, LanguageService } from '../../shared/services';
import { TranslateService } from '@ngx-translate/core';
import { GoalService } from 'app/shared/services/goal.service';
import { LectureService } from 'app/shared/services/lecture.service';
import { LectureSectionService } from 'app/shared/services/lecture-section.service';
import { ProgressService } from 'app/shared/services/progress.service';
import { ModalLectureWatch } from '../modal-lecture-watch/modal-lecture-watch';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.html'
})
export class DetailCourseComponent implements OnInit {
  closeResult: string;
  public targetType: String = 'course';
  public courseParam: string;
  public courseId: String = '';
  public course: ICourse;
  public slots: IMylesson[];
  public slotChunks: IMylesson[][];
  public goals: ICourseGoal[][];
  public sections: any[]
  public lectures: any[]
  public isShowSlot: boolean = false;
  public emailRecipient: any = '';
  public salePrice: any;
  public coupon: ICoupon;
  public saleValue: any;
  public usedCoupon: boolean = false;
  public appliedCoupon: boolean = false;
  public couponCode: any = '';
  public canBooking: boolean = true;
  public currentUser: IUser;
  public booked: boolean = false;
  public isLoggedin: boolean = false;
  public slotLeft: number;
  visibleLecture = '';
  totalCourseSec = 0;
  progress: any;
  progressValue;
  public optionsReview: any = {
    courseId: '',
    type: 'course'
  };
  public optionsCoupon: any = {
    courseId: '',
    tutorId: '',
    targetType: 'course',
    couponId: ''
  };
  public type: any;
  public statsReview: IStatsReview = {
    ratingAvg: 0,
    ratingScore: 0,
    totalRating: 0
  };
  public config: any;
  public isHidden: boolean = false;



  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private goalService: GoalService,
    private calendarService: CalendarService,
    private auth: AuthService,
    private toasty: ToastrService,
    private progressService: ProgressService,
    private lectureSectionService: LectureSectionService,
    private lectureService: LectureService,
    private router: Router,
    private courseFavoriteService: FavoriteService,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    this.courseParam = this.route.snapshot.params.id;
    this.config = this.route.snapshot.data['appConfig'];
    this.progressValue = 0
  }

  ngOnInit() {
    this.findOneCourse();
    if (this.auth.isLoggedin()) {
      this.isLoggedin = true;
      this.auth.getCurrentUser().then(resp => (this.currentUser = resp));
    }
  }

  updateProgress(duration, lectureId, value) {
    let s = this.getSecondsFromDuration(duration);
    let mediaUrl = '';

    this.lectures.forEach(l => {
      l.media.forEach(element => {
        if (element.id == lectureId) {
          mediaUrl = element.fileUrl
        }
      });
    })

    const modalRef = this.modalService.open(ModalLectureWatch, { centered: true, size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.url = mediaUrl

    modalRef.componentInstance.type = value.type

    if (!this.progress || (this.progress && !this.progress.watchedLecture.includes(lectureId))) {
      this.progressValue += s;
      if (this.progress) {
        this.progress.progress = s + '';
        let w = this.progress.watchedLecture
        w.push(lectureId)
        let p = {
          progress: this.progressValue + '',
          courseId: this.courseId,
          progressValue: this.getProgressValue() + '',
          watchedLecture: w
        }
        this.progressService.update(this.progress._id, p).then(r => {
          this.progress = r.data;
        })
      } else {
        let p = {
          progress: this.progressValue + '',
          courseId: this.courseId,
          progressValue: this.getProgressValue() + '',
          watchedLecture: [lectureId]
        }
        this.progressService.create(p).then(r => {
          this.progress = r.data;
        })
      }
    }


  }

  setVisibleLecture(lecture) {
    if (this.visibleLecture == lecture) this.visibleLecture = ''
    else this.visibleLecture = lecture
  }

  getTotalLectures(id) {
    let c = 0;
    if (this.lectures) {
      this.lectures.forEach(l => {
        if (l.sectionId == id) {
          c++;
        }
      })
    }
    return c;
  }

  getTotalDurationCourse() {
    let secs = 0;
    if (this.lectures) {
      this.lectures.forEach(l => {
        let i = JSON.parse(l.mediaInfo)
        i.forEach(element => {
          secs += this.getSecondsFromDuration(element.duration);
        });
      })
    }
    this.totalCourseSec = secs
    return this.getDurationString(secs, true);
  }

  getMediaValue(id, lecture) {
    const mediasObj = JSON.parse(lecture.mediaInfo)
    for (let index = 0; index < mediasObj.length; index++) {
      const element = mediasObj[index];

      if (element.media_id == id) {
        return element
      }
    }
    return null;
  }

  getTotalDurationSection(sectionId) {
    let secs = 0;
    const section = this.sections.find(s => s._id == sectionId);
    if (this.lectures) {
      this.lectures.forEach(l => {
        if (l.sectionId == sectionId) {
          let i = JSON.parse(l.mediaInfo)
          i.forEach(element => {
            secs += this.getSecondsFromDuration(element.duration);
          });
        }
      })
    }

    return this.getDurationString(secs, true);
  }

  getDurationString(secs, includeStr = false) {
    const hours = Math.floor(secs / 60 / 60);
    const minutes = Math.floor(secs / 60) - (hours * 60);

    // 42
    const seconds = Math.floor(secs % 60);
    if (includeStr)
      return "" + (hours ? hours + 'h:' : '') + (minutes ? (minutes > 10 ? minutes + 'm:' : '0' + minutes + 'm:') : '00:') + (seconds ? (seconds > 10 ? seconds : '0' + seconds) + 's' : '')
    else
      return "" + (hours ? hours + ':' : '') + (minutes ? (minutes > 10 ? minutes + ':' : '0' + minutes + ':') : '00:') + (seconds ? (seconds > 10 ? seconds : '0' + seconds) + '' : '')
  }

  getTotalDurationLecture(lectureId) {
    let secs = 0;
    const lecture = this.lectures.find(s => s._id == lectureId);
    let i = JSON.parse(lecture.mediaInfo)
    i.forEach(element => {
      secs += this.getSecondsFromDuration(element.duration);
    });
    return this.getDurationString(secs, true);
  }

  updateProgressValue(value) {
    this.progressValue = value;
    this.cdRef.detectChanges();
    console.log(this.progressValue)
  }

  getProgressValue() {
    if (this.progressValue == 0)
      return 0
    return Math.floor((this.progressValue / this.totalCourseSec) * 100)
  }

  getSecondsFromDuration(duration) {
    let t = duration.split(':')
    let s = 0;
    if (t.length == 3) {
      s += (parseInt(t[0])) * 3600;
      s += (parseInt(t[1])) * 60;
      s += (parseInt(t[2]));
    }
    if (t.length == 2) {
      s += (parseInt(t[0])) * 60;
      s += (parseInt(t[1]));
    }
    if (t.length == 1) {
      s += (parseInt(t[0]));
    }
    return s;
  }

  findOneCourse() {
    this.courseService
      .findOne(this.courseParam)
      .then(resp => {
        this.course = resp.data;
        this.courseId = resp.data._id;
        this.optionsReview.courseId = this.courseId;
        if (this.course.booked) {
          this.progressService.getCurrentCoupon({
            courseId: this.courseId || ''
          }).then(r => {
            if (r.data.length > 0) {
              this.progress = r.data[0];
              this.updateProgressValue(parseInt(this.progress.progress))
              this.cdRef.detectChanges()
            }

          })
          this.lectureSectionService
            .getCurrentSections({
              courseId: this.courseId || '',
              tutorId: resp.data.tutorId || ''
            })
            .then(resp => {
              if (resp && resp.data) {
                let d: [] = resp.data;
                this.sections = d.sort((a: any, b: any) => a.ordering - b.ordering)
              }
            });
          this.lectureService.getCurrentSections({
            courseId: this.courseId || '',
            tutorId: resp.data.tutorId || ''
          }).then(resp => {
            if (resp && resp.data) {
              let d: [] = resp.data;
              this.lectures = d.sort((a: any, b: any) => a.ordering - b.ordering)
            }
          });
        }
        this.goalService.getCurrentCoupon({
          courseId: this.courseId || '',
          tutorId: resp.data.tutorId || ''
        }).then(res => {
          if (res && res.data) {
            this.goals = res.data;
          }
        })
        if (this.course._id) {
          this.statsReview = {
            ...this.statsReview,
            ...{
              ratingAvg: this.course.ratingAvg,
              totalRating: this.course.totalRating,
              ratingScore: this.course.ratingScore
            }
          };
          this.optionsCoupon.tutorId = this.course.tutor._id;
          this.optionsCoupon.courseId = this.course._id;
          if (this.course.coupon && this.auth.isLoggedin()) {
            this.optionsCoupon.couponId = this.course.coupon._id;
          }
          this.salePrice = this.course.price;
          this.slotLeft = this.course.maximumStrength - this.course.numberParticipants;

          // this.findSlots();
          if (this.auth.isLoggedin()) {
            this.booked = this.course.booked
          }
        }
      })
      .catch(err => {
        if (err.data.code == '404') this.router.navigate(['pages/404-not-found']);
        else {
          this.router.navigate(['pages/error', err.data.code]);
        }
      });


  }

  // findSlots() {
  //   this.calendarService
  //     .search({ courseId: this.courseId, take: 100, sortBy: 'startTime', sortType: 'desc' })
  //     .then(async resp => {
  //       this.slots = resp.data.items;
  //       if (this.slots.length) {
  //         await this.slots.forEach(slot => {
  //           this.checkVisableSlot(slot);
  //         });
  //         await this.checkCanBooking(this.slots);
  //         this.slotChunks = _.chunk(this.slots, 2);
  //         if (this.slotChunks.length > 2) {
  //           this.isHidden = true;
  //         }
  //         this.isShowSlot = true;
  //       }
  //     })
  //     .catch(err => this.toasty.error(this.translate.instant('something went wrong!')));
  // }

  enrollCourse(course: any, type: string) {
    if (!this.auth.isLoggedin()) {
      return this.toasty.error(this.translate.instant('Please login to enroll the course!'));
    }
    if (this.course.numberParticipants >= this.course.maximumStrength) {
      return this.toasty.error(this.translate.instant('No slot available!'));
    }
    if (type === 'booking') {
      this.confirmEnroll(course, type);

    } else this.confirmEnroll(course, type);
  }

  confirmEnroll(course: any, type: string) {
    const params = Object.assign({
      targetType: this.targetType,
      targetId: course._id,
      tutorId: course.tutorId,
      redirectSuccessUrl: window.appConfig.url + '/payments/success',
      cancelUrl: window.appConfig.url + '/payments/cancel',
      type: type,
      emailRecipient: this.emailRecipient
    });
    if (!this.usedCoupon && this.course.coupon && this.course.coupon.code && this.appliedCoupon) {
      params.couponCode = this.course.coupon.code;
    }
    if (this.salePrice <= 0 || course.isFree) {
      return this.courseService
        .enroll(params)
        .then(resp => {
          if (resp.data.status === 'completed') {
            return this.router.navigate(['/payments/success']);
          } else {
            return this.router.navigate(['/payments/cancel']);
          }
        })
        .catch(e => {
          this.toasty.error(
            this.translate.instant(
              (e.data && e.data.data && e.data.data.message) ||
              e.data.message ||
              'Something went wrong, please try again!'
            )
          );
          this.router.navigate(['/payments/cancel']);
        });
    } else {
      localStorage.setItem('paymentParams', JSON.stringify(params));
      return this.router.navigate(['/payments/pay'], {
        queryParams: {
          type: type,
          targetType: 'course',
          targetName: course.name,
          tutorName: course.tutor.name
        },
        state: params
      });
    }
  }

  checkUsedCoupon(used: boolean) {
    this.usedCoupon = used;
  }

  applyCoupon(event: { appliedCoupon: boolean; code: string }) {
    this.appliedCoupon = event.appliedCoupon;
    this.course.coupon.code = event.code;
    if (this.appliedCoupon && this.course.coupon && this.auth.isLoggedin()) {
      if (this.course.coupon.type === 'percent') {
        this.saleValue = this.course.coupon.value;
        this.salePrice = this.course.price - this.course.price * (this.saleValue / 100);
      } else if (this.course.coupon.type === 'money') {
        this.saleValue = this.course.coupon.value;
        this.salePrice = this.course.price - this.saleValue;
      }
    } else {
      this.salePrice = this.course.price || 0;
    }
  }

  // checkVisableSlot(slot: any) {
  //   if (moment.utc().add(30, 'minutes').isAfter(moment.utc(slot.startTime))) {
  //     slot.disable = true;
  //   } else {
  //     slot.disable = false;
  //   }
  // }

  checkCanBooking(slots: any) {
    this.canBooking = true
  }

  favorite() {
    if (!this.isLoggedin) this.toasty.error(this.translate.instant('Please loggin to use this feature!'));
    else {
      let params = Object.assign(
        {
          courseId: this.course._id,
          type: 'course'
        },
        {}
      );
      this.courseFavoriteService
        .favorite(params, 'course')
        .then(res => {
          this.course.isFavorite = true;
          this.toasty.success(this.translate.instant('Added to your favorite course list successfully!'));
        })
        .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }

  unFavorite() {
    if (!this.isLoggedin) this.toasty.error(this.translate.instant('Please loggin to use this feature!'));
    else {
      this.courseFavoriteService
        .unFavorite(this.course._id, 'course')
        .then(res => {
          this.course.isFavorite = false;
          this.toasty.success(this.translate.instant('Deleted from your favorite course list successfully!'));
        })
        .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }
}
