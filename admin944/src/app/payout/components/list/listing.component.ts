import { Component, OnInit } from '@angular/core';
import { RequestPayoutService } from '../../services/request-payout.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TutorService } from '../../../tutor/tutor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-payout-listing',
  templateUrl: './listing.html'
})
export class ListingComponent implements OnInit {
  public items = [];
  public page: Number = 1;
  public take: Number = 10;
  public total: Number = 0;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public dateFilter: any = {};
  public stats: any;
  public tutorId: any;
  public searching: any = false;
  public searchFailed: any = false;
  public service: any;
  public config: any;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.tutorService
          .search({ name: term })
          .then(resp => {
            this.searchFailed = false;
            this.searching = false;
            return resp.data.items;
          })
          .catch(err => {
            this.searchFailed = true;
            this.searching = false;
            return of([]);
          })
      ),
      tap(() => (this.searching = false))
      // tslint:disable-next-line:semicolon
    );

  formatter = (x: { name: String }) => x.name;

  constructor(
    private payoutService: RequestPayoutService,
    private toasty: ToastrService,
    private tutorService: TutorService,
    private route: ActivatedRoute
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.query();
    this.queryStats();
  }

  query() {
    const params = Object.assign(
      {
        page: this.page,
        take: this.take,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`
      },
      this.searchFields
    );
    if (this.dateFilter.from && this.dateFilter.to) {
      params.startDate = new Date(this.dateFilter.from).toUTCString();
      params.toDate = new Date(this.dateFilter.to).toUTCString();
    }
    if (this.tutorId) {
      params.tutorId = this.tutorId._id;
    }
    this.payoutService
      .search(params)
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  queryStats() {
    const params = Object.assign({});
    if (this.dateFilter.from && this.dateFilter.to) {
      params.startDate = new Date(this.dateFilter.from).toUTCString();
      params.toDate = new Date(this.dateFilter.to).toUTCString();
    }
    if (this.tutorId) {
      params.tutorId = this.tutorId._id;
    }
    this.payoutService.stats(params).then(resp => {
      this.stats = resp.data;
    });
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }
  dateChangeEvent(dateChange: any) {
    if (!dateChange) {
      return this.toasty.error('Something went wrong, please try again.');
    }
    this.dateFilter = dateChange;
  }
}
