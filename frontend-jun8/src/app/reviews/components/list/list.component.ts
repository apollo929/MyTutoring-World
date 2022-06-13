import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { AuthService, UtilService } from '../../../shared/services';
import { ReviewService } from '../../services/review.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ReviewUpdateComponent } from '../update/update.component';
import { IReview, IFilterReview, IStatsReview } from '../../interface';
@Component({
  selector: 'review-list',
  templateUrl: './list.html'
})
export class ReviewListComponent implements OnInit {
  @Input() options: IFilterReview;
  @Input() canWriteReview: boolean = true;
  @Input() type: string = 'tutor';
  @Input() stats: IStatsReview = {
    totalRating: 0,
    ratingAvg: 0,
    ratingScore: 0
  };
  public page: any = 1;
  public pageSize: any = 10;
  public writeReview: boolean = false;
  public reviews: IReview[] = [];
  public total: any = 0;
  public userId: any = '';
  public oldRating: number;
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private modalService: NgbModal,
    private utilService: UtilService
  ) {
    if (this.authService.isLoggedin()) {
      this.authService.getCurrentUser().then(res => {
        this.userId = res._id;
      });
    }
  }
  ngOnInit() {
    this.query();
    // this.reviewService.current(this.options.type, this.options.appointmentId).then(resp => {
    //   if (resp.data && resp.data._id) this.reviews.push(resp.data);
    // });
  }

  query() {
    // this.utilService.setLoading(true);
    this.reviewService
      .list(
        Object.assign({
          page: this.page,
          take: this.pageSize,
          rateTo: this.options.rateTo || '',
          courseId: this.options.courseId,
        })
      )
      .then(res => {
        // this.utilService.setLoading(false);
        this.reviews = res.data.items;
        this.reviews.forEach(item => {
          if (item.rateBy === this.userId) this.canWriteReview = false;
        });
        // if (this.reviews.length) {
        //   this.canWriteReview = false;
        // }
        this.total = this.reviews.length;
      });
  }

  onRating(event: any) {
    if (event && event._id) {
      this.canWriteReview = false;
    }
    this.reviews.push(event);
    this.updateStatsOnCreate(event);
  }

  update(item: any, index: number) {
    this.oldRating = item.rating;
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(ReviewUpdateComponent, ngbModalOptions);
    modalRef.componentInstance.reviewId = item._id;
    modalRef.result.then(
      result => {
        if (result._id) {
          this.reviews[index] = result;
          this.updateStatsOnUpdate(result);
        }
      },
      () => { }
    );
  }

  updateStatsOnCreate(newReview: any) {
    let oldTotalRating = this.stats.totalRating;
    let newRating = (this.stats.ratingAvg * oldTotalRating + newReview.rating) / (oldTotalRating + 1);
    this.stats.totalRating++;
    this.stats.ratingAvg = Math.round(newRating);
  }

  updateStatsOnUpdate(review: any) {
    let newRating =
      (this.stats.ratingAvg * this.stats.totalRating - this.oldRating + review.rating) / this.stats.totalRating;
    this.stats.ratingAvg = Math.round(newRating);
  }
}
