import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { AppointmentService } from '../../../../shared/services';
import { RequestRefundService } from '../../../../refund/services/request-refund.service';
import { AuthService } from '../../../../shared/services';
import { IMylesson } from '../../../interface';
import { IFilterReview, IStatsReview } from '../../../../reviews/interface';
import { ReviewService } from '../../../../reviews/services/review.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-detail-lesson',
  templateUrl: './detail.html'
})
export class LessonDetailComponent implements OnInit {
  public appointment: IMylesson = {};
  private aId: any;
  public medias: any[];
  public isShowRefundButton: Boolean = false;
  public reason: string = '';
  public submitted: Boolean = false;
  public review: any;
  public options: IFilterReview = {
    appointmentId: '',
    webinarId: '',
    type: '',
    rateTo: '',
    rateBy: ''
  };
  public statsReview: IStatsReview = {
    ratingAvg: 0,
    ratingScore: 0,
    totalRating: 0
  };
  public type: any;
  public config: any;
  public documents: any[] = [];
  public documentOptions: Object;
  public documentIds: string[] = [];
  public filesSelected: any = [];
  public maxFileSize: number;
  public canReschedule: boolean = true;
  public showCalendar: boolean = false;
  public joining: boolean = false;
  public canReview: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private translate: TranslateService
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.aId = this.route.snapshot.paramMap.get('id');
    this.maxFileSize = window.appConfig.maximumFileSize;
    this.authService.getCurrentUser().then(resp => {
      this.type = resp.type;
    });
    this.appointmentService
      .findOne(this.aId)
      .then(resp => {
        this.appointment = resp.data;
        if (this.appointment.status === 'completed' || this.appointment.status === 'progressing') this.canReview = true;
        if (this.appointment.documents && this.appointment.documents.length) {
          this.documents = resp.data.documents;
          this.documentIds = resp.data.documents.map(d => d._id);
        }
        this.statsReview = {
          ...this.statsReview,
          ...{
            ratingAvg: this.appointment.tutor.ratingAvg,
            totalRating: this.appointment.tutor.totalRating,
            ratingScore: this.appointment.tutor.ratingScore
          }
        };
        this.reviewService.current(this.appointment._id, { rateTo: this.appointment.tutor._id }).then(resp => {
          if (resp.data !== null) {
            this.review = resp.data;
          }
        });
        this.documentOptions = {
          url: window.appConfig.apiBaseUrl + `/appointments/${this.aId}/upload-document`,
          fileFieldName: 'file',
          onFinish: resp => {
            this.documentIds.push(resp.data._id);
            this.documents.push(resp.data);
          },
          onFileSelect: resp => (this.filesSelected = resp),
          id: 'file-upload'
        };
        if (this.appointment.paid) {
          this.isShowRefundButton = true;
        }
        this.options.appointmentId = this.appointment._id;
        this.options.type = this.appointment.targetType;
        this.options.rateTo = this.appointment.tutor._id;
        this.options.rateBy = this.appointment.user._id;
        if (this.options.type === 'webinar') {
          this.options.webinarId = this.appointment.webinarId;
          this.medias = this.appointment.webinar.media;
        }
      })
      .catch(e => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));

    this.appointmentService.canReschedule(this.aId).then(resp => {
      this.canReschedule = resp.data.canReschedule;
    });
  }

  cancel() {
    this.submitted = true;
    if (this.reason === '') {
      return this.toasty.error(this.translate.instant('Please enter reason'));
    }
    this.appointmentService
      .studentCancel(this.appointment._id, { reason: this.reason })
      .then(resp => {
        this.appointment.status = 'canceled';
        this.appointment.cancelReason = this.reason;
        this.toasty.success(this.translate.instant('Canceled successfully!'));
      })
      .catch(err =>
        this.toasty.error(
          this.translate.instant(
            (err.data && err.data.data && err.data.data.message) ||
              err.data.message ||
              'Something went wrong, please try again!'
          )
        )
      );
  }

  updateDocs() {
    const params = {
      documentIds: this.documentIds
    };
    this.appointmentService
      .updateDocument(this.aId, params)
      .then(resp => {
        this.toasty.success(this.translate.instant('Update successfully'));
      })
      .catch(e => {
        this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
      });
  }

  chooseSlot(time: any) {
    if (window.confirm(this.translate.instant('Are you sure to reschedule to this slot?'))) {
      let data = {
        startTime: time.start,
        toTime: time.end
      };

      if (time.extendedProps.isDST) {
        data.startTime = time.extendedProps.item.startTime;
        data.toTime = time.extendedProps.item.toTime;
      }
      this.appointmentService
        .checkOverlap({ startTime: time.start, toTime: time.end })
        .then(resp => {
          if (!resp.data.checkOverlap) {
            if (
              window.confirm(
                this.translate.instant('This slot is overlap with your booked slot. Still reschedule to it?')
              )
            ) {
              this.appointmentService
                .reSchedule(this.appointment._id, data)
                .then(resp => {
                  this.toasty.success(this.translate.instant('Reschedule successfully'));
                  this.appointment.startTime = data.startTime;
                  this.appointment.toTime = data.toTime;
                  this.showCalendar = false;
                })
                .catch(err => {
                  this.toasty.error(
                    this.translate.instant(
                      err.data.data.message || err.data.message || 'Something went wrong, please try again!'
                    )
                  );
                });
            }
          } else {
            this.appointmentService
              .reSchedule(this.appointment._id, data)
              .then(resp => {
                this.toasty.success(this.translate.instant('Reschedule successfully'));
                this.appointment.startTime = data.startTime;
                this.appointment.toTime = data.toTime;
                this.showCalendar = false;
              })
              .catch(err => {
                this.toasty.error(
                  this.translate.instant(
                    err.data.data.message || err.data.message || 'Something went wrong, please try again!'
                  )
                );
              });
          }
        })
        .catch(e => {
          this.toasty.error(this.translate.instant(e.data.data.message || 'Something went wrong, please try again!'));
        });
    }
  }

  joinMeeting() {
    if (!this.joining) {
      this.joining = true;
      this.appointmentService
        .joinMeeting(this.appointment._id)
        .then(resp => {
          this.joining = false;
          if (resp.data && resp.data.zoomUrl) {
            window.open(resp.data.zoomUrl, '_blank').focus();
          }
        })
        .catch(err => {
          this.joining = false;
          return this.toasty.error(
            this.translate.instant(
              (err.data && err.data.data && err.data.data.message) ||
                err.data.message ||
                'Something went wrong, please try again!'
            )
          );
        });
    } else {
      this.toasty.success(this.translate.instant('Connecting...'));
    }
  }
}
