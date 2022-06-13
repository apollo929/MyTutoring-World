import { Component, OnInit } from '@angular/core';
import { AccountService, RequestPayoutService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../shared/services';
import { AuthService } from '../../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
import { IPayoutAccount, IPayoutRequest } from '../interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'request-payout-listing',
  templateUrl: './listing.html'
})
export class ListingRequestComponent implements OnInit {
  public items: IPayoutRequest[] = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public tutorId: any;
  public dateChange: any = {};
  public searchFields: any = {};

  public payoutAccountId: any = '';
  public accounts: IPayoutAccount[] = [];
  public balance: IPayoutRequest;

  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public stats: any;
  public loading: boolean = false;
  config: any = {};
  // chart options
  single: any[];
  view: any[] = [700, 400];
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };
  public loadingBalance: boolean = true;

  constructor(
    private payoutService: RequestPayoutService,
    private toasty: ToastrService,
    private seoService: SeoService,
    private authService: AuthService,
    public accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    seoService.update('Payout Request Manager');
    this.accounts = this.route.snapshot.data['account'];
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.authService.getCurrentUser().then(resp => {
      this.tutorId = resp.id;
      this.queryStats();
      const params = {
        tutorId: this.tutorId
      };
      this.queryBalance(params);
      // this.query();
    });
  }

  query() {
    this.loading = true;
    this.payoutService
      .search(
        Object.assign(
          {
            page: this.page,
            take: this.take,
            sort: `${this.sortOption.sortBy}`,
            sortType: `${this.sortOption.sortType}`,
            tutorId: this.tutorId
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
        this.loading = false;
        alert('Something went wrong, please try again!');
      });
  }

  queryStats() {
    const params = Object.assign({});
    params.tutorId = this.tutorId;
    if (this.dateChange.from && this.dateChange.to) {
      params.startDate = this.dateChange.from;
      params.toDate = this.dateChange.to;
    }
    this.payoutService.stats(params).then(resp => {
      this.stats = resp.data;
    });
  }

  queryBalance(params: any) {
    this.loadingBalance = true;
    this.payoutService
      .getBalance(params)
      .then(resp => {
        this.balance = resp.data;
        this.single = Object.keys(this.balance).map(item => {
          let name = `${this.translate.instant(item.toUpperCase())} - ${
            this.config.currencySymbol ? this.config.currencySymbol : '$'
          } ${this.balance[item]}`;
          return {
            name: name,
            value: this.balance[item],
            extra: {
              currency: this.config.currencySymbol ? this.config.currencySymbol : '$'
            }
          };
        });
        this.loadingBalance = false;
      })
      .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
  }

  formatTooltipText(data) {
    return `<span>${data.data.name}</br>${data.data.extra.currency + ' ' + data.value}</span>`;
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  dateChangeEvent(dateChange: any) {
    if (!dateChange) {
      return this.toasty.error(this.translate.instant('Something went wrong, please try again.'));
    }
    this.dateChange = dateChange;
  }

  submitRequest() {
    if (!this.payoutAccountId) {
      return this.toasty.error(this.translate.instant('Please enter Payout Account Id'));
    }
    this.payoutService
      .create({ payoutAccountId: this.payoutAccountId })
      .then(res => {
        this.items.push(res.data);
        this.toasty.success(this.translate.instant('Your request has been sent.'));
        // this.router.navigate(['/users/payout/request']);
      })
      .catch(err => {
        this.toasty.error(
          this.translate.instant(err.data.message || err.data.data.message || 'Something went wrong, please try again')
        );
      });
  }

  onSort(evt) {
    this.sortOption = evt;
    this.query();
  }

  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    this.query();
  }

  ngAfterViewInit() {
    $('#btn-send-request').click(function () {
      $('html, body').animate(
        {
          scrollTop: $('#send-request').offset().top
        },
        800
      );
    });
  }
}
