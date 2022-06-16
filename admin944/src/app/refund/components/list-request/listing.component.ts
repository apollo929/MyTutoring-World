import { Component, OnInit } from '@angular/core';
import { RequestRefundService } from '../../services/request-refund.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-refund-listing',
  templateUrl: './listing.html'
})
export class ListingRequestComponent implements OnInit {
  public items = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public userId: any;
  public dateChange: any = {};
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public stats: any;
  public config: any;
  constructor(
    private refundService: RequestRefundService,
    private toasty: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.authService.getCurrentUser().then(resp => {
      this.query();
    });
  }

  query() {
    this.refundService
      .search(
        Object.assign(
          {
            page: this.page,
            take: this.take,
            sort: `${this.sortOption.sortBy}`,
            sortType: `${this.sortOption.sortType}`
          },
          this.searchFields
        )
      )
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => alert(`An error has occurred. Try Again!`));
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }
  dateChangeEvent(dateChange: any) {
    if (!dateChange) {
      return this.toasty.error(`An error has occurred. Try Again!`);
    }
    this.dateChange = dateChange;
  }
}
