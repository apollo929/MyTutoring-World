import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../shared/services';
import * as _ from 'lodash';
import { IPayoutAccount } from '../interface';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  selector: 'account-listing',
  templateUrl: './listing.html'
})
export class ListingAccountsComponent implements OnInit {
  public accounts: IPayoutAccount[] = [];
  public page: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 0;
  public timeout: any;
  public searchFields: any = {};
  public searchType: any = '';
  public sortOption: any = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public loading: boolean = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private toasty: ToastrService,
    private seoService: SeoService,
    private translate: TranslateService
  ) {
    seoService.update('Accounts manager');
  }

  ngOnInit() {
    this.query();
  }

  query() {
    this.loading = true;
    let params = {
      page: this.page,
      take: this.pageSize,
      sort: `${this.sortOption.sortBy}`,
      sortType: `${this.sortOption.sortType}`,
      type: this.searchType
    };

    this.accountService
      .find(params)
      .then(res => {
        this.accounts = res.data.items;
        this.total = res.data.count;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
      });
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
    }
  }

  remove(itemId: any, index: number) {
    if (window.confirm(this.translate.instant('Are you sure want to delete this item?'))) {
      this.accountService
        .remove(itemId)
        .then(() => {
          this.toasty.success(this.translate.instant('Item has been deleted!'));
          this.accounts.splice(index, 1);
        })
        .catch(err =>
          this.toasty.error(this.translate.instant(err.data.message || 'Something went wrong, please try again!'))
        );
    }
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

  onSort(evt) {
    this.sortOption = evt;
    this.query();
  }

  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    this.query();
  }
}
