import { Component, OnInit } from '@angular/core';
import { RequestRefundService } from '../../services/request-refund.service';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../shared/services';
import { AuthService } from '../../../shared/services';
import { IRefund } from '../../interface';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-request-refund-listing',
  templateUrl: './listing.html'
})
export class ListingRequestComponent implements OnInit {
  public items: IRefund[] = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public userId: any;
  public dateChange: any = {};
  public searchFields: any = {};
  public timeout: any;
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public stats: any;
  public loading: Boolean = true;
  public config: any;
  constructor(
    private refundService: RequestRefundService,
    private toasty: ToastrService,
    private seoService: SeoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    seoService.update('Refund Request Manager');
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.authService.getCurrentUser().then(resp => {
      this.userId = resp.id;
      this.query();
    });
  }

  query() {
    this.loading = true;
    this.refundService
      .search(
        Object.assign(
          {
            page: this.page,
            take: this.take,
            sort: `${this.sortOption.sortBy}`,
            sortType: `${this.sortOption.sortType}`,
            userId: this.userId
          },
          this.searchFields
        )
      )
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
        this.loading = false;
      })
      .catch(() => {
        alert(this.translate.instant(`Something went wrong. Please try again!`));
        this.loading = false;
      });
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }
  dateChangeEvent(dateChange: any) {
    if (!dateChange) {
      return this.toasty.error(this.translate.instant(`Something went wrong. Please try again!`));
    }
    this.dateChange = dateChange;
  }
  onSort(evt) {
    this.sortOption = evt;
    this.query();
  }

  doSearch(evt) {
    const searchText = evt.target.value; // this is the search text
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(() => {
      this.searchFields.name = searchText;
      this.query();
    }, 400);
  }

  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    this.query();
  }
}
