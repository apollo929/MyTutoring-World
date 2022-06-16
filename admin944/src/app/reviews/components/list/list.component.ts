import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { AuthService } from '../../../shared/services';
import { ReviewService } from '../../services/review.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ReviewUpdateComponent } from '../update/update.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-review-tutor',
  templateUrl: './list.html'
})
export class ReviewTutorComponent implements OnInit {
  @Input() tutorId: any = '';
  public page: any = 1;
  public pageSize: any = 5;
  public reviews: any = [];
  public total: any = 0;

  constructor(
    private reviewService: ReviewService,
    private toasty: ToastrService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.query();
  }

  query() {
    this.reviewService
      .list(
        Object.assign(
          {
            page: this.page,
            take: this.pageSize
          },
          {
            rateTo: this.tutorId
          }
        )
      )
      .then(res => {
        this.reviews = res.data.items;
        this.total = res.data.count;
      });
  }

  update(item: any, i: number) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    const modalRef = this.modalService.open(ReviewUpdateComponent, ngbModalOptions);
    modalRef.componentInstance.reviewId = item._id;
    modalRef.result.then(
      result => {
        if (result._id) {
          this.reviews[i] = result;
        }
      },
      () => {}
    );
  }

  remove(item: any, i: number) {
    if (window.confirm('Are you sure want to delete this review?')) {
      this.reviewService
        .remove(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.reviews.splice(i, 1);
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }
}
