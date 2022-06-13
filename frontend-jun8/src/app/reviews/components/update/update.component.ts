import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ReviewService } from '../../services/review.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'review-edit',
  templateUrl: './update.html',
  styleUrls: ['../star-rating/star-rating.scss']
})
export class ReviewUpdateComponent implements OnInit {
  @Input() reviewId: any;
  public review: any = {};
  public submitted: boolean = false;
  public hovered: number;

  constructor(
    private translate: TranslateService,
    private toasty: ToastrService,
    private reviewService: ReviewService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    // check review allowable or not
    this.reviewService
      .findOne(this.reviewId)
      .then(resp => {
        this.review = resp.data;
      })
      .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again.')));
  }

  submit() {
    this.submitted = true;

    if (!this.review.comment) {
      return this.toasty.error(this.translate.instant('Invalid form, please recheck again.'));
    }

    const data = _.pick(this.review, ['comment', 'rating']);
    this.reviewService
      .update(this.review._id, data)
      .then(resp => {
        this.toasty.success(this.translate.instant('Updated successfully!'));
        this.activeModal.close(resp.data);
      })
      .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again.')));
  }
}
