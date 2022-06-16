import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ReviewService } from '../../services/review.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-edit',
  templateUrl: './update.html',
  styleUrls: ['./star-rating.scss']
})
export class ReviewUpdateComponent implements OnInit {
  @Input() reviewId: any;
  public review: any = {};
  public submitted: Boolean = false;
  public hovered: number;

  constructor(
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
        this.review.rating = resp.data.rating;
        this.review.comment = resp.data.comment;
      })
      .catch(() => this.toasty.error('Something went wrong, please try again.'));
  }

  submit() {
    this.submitted = true;

    if (!this.review.comment) {
      return this.toasty.error('Invalid form, please recheck again.');
    }

    const data = _.pick(this.review, ['comment', 'rating']);
    this.reviewService
      .update(this.review._id, data)
      .then(resp => {
        this.toasty.success('Updated successfully!');
        this.activeModal.close(resp.data);
      })
      .catch(() => this.toasty.error('Something went wrong, please try again.'));
  }
}
