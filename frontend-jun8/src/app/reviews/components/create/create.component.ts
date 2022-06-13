import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { AuthService } from '../../../shared/services';
import { ReviewService } from '../../services/review.service';
import { IReview } from '../../interface';
import { IUser } from '../../../user/interface';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'review-card',
  templateUrl: './create.html',
  styleUrls: ['.././star-rating/star-rating.scss']
})
export class CreateReviewComponent implements OnInit {
  @Input() reviews: IReview[];
  @Input() options: any;
  @Output() onRating = new EventEmitter();
  public hovered: number;
  public review: IReview = {
    comment: '',
    rating: 3,
    appointmentId: '',
    type: '',
    webinarId: null,
    courseId: null
  };
  public params: any;
  public currentUser: IUser;
  public isLoggedin: boolean = false;
  public submitted: boolean = false;
  public checkReview: boolean = false;

  constructor(
    private toasty: ToastrService,
    private translate: TranslateService,
    private reviewService: ReviewService,
    private auth: AuthService
  ) {
    if (auth.isLoggedin()) {
      this.isLoggedin = true;
    }
  }

  ngOnInit() {
    if (this.review && this.review.comment) {
      this.checkReview = true;
    } else if ((!this.review || !this.review.comment) && this.auth.isLoggedin()) {
      this.reviewService.current(this.options.appointmentId, { rateBy: this.options.rateBy }).then(resp => {
        if (resp.data !== null) {
          this.checkReview = true;
        }
      });
    }
  }

  submit(frm: any) {
    this.submitted = true;
    this.review.appointmentId = this.options.appointmentId || null;
    this.review.webinarId = this.options.webinarId || null;
    this.review.courseId = this.options.courseId || null;
    this.review.type = this.options.type;
    this.reviewService
      .create(Object.assign(this.review))
      .then(resp => {
        this.review = {
          comment: '',
          rating: 3,
          appointmentId: this.options.appointmentId,
          type: this.options.type,
          webinarId: this.options.webinarId,
          courseId: this.options.courseId
        };
        this.onRating.emit(resp.data);
        this.submitted = false;
        this.checkReview = true;
      })
      .catch(err => {
        this.toasty.error(this.translate.instant('Something went wrong, please try again.'));
      });
  }
}
