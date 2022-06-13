import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { AuthService, UtilService } from '../../../shared/services';
import { ReviewService } from '../../../reviews/services/review.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-tutor',
  templateUrl: './list.html'
})
export class ReviewTutorComponent implements OnInit {
  @Input() tutorId: any;
  public page: any = 1;
  public pageSize: any = 5;
  public reviews: any = [];
  public total: any = 0;
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private modalService: NgbModal,
    private utilService: UtilService,

  ) {}
  ngOnInit() {
    
    this.query();
  }

  query() {
    this.utilService.setLoading(true);
   
    this.reviewService
      .list(
        Object.assign(
          {
            page: this.page,
            take: this.pageSize
          },
          {
            type: 'appointment',
            rateTo: this.tutorId
          }
        )
      )
      .then(res => {
        this.utilService.setLoading(false);
        this.reviews = res.data.items;
        this.total = res.data.count;
      });
  }
}
