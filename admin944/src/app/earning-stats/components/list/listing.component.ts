import { Component, OnInit } from '@angular/core';
import { EarningStatsService } from '../../services/earning-stats.service';
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
    sortBy: 'tutorId',
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
    private earningStatsService: EarningStatsService,
    private toasty: ToastrService,
    private tutorService: TutorService,
    private route: ActivatedRoute
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.query();
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

    if (this.tutorId) {
      params.tutorId = this.tutorId._id;
    }
    this.earningStatsService
      .search(params)
      .then(resp => {
        this.items = resp.data.items;
        this.total = resp.data.count;
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
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

  export(event) {
    const params = Object.assign(
      {
        page: this.page,
        take: this.take,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`
      },
      this.searchFields
    );

    if (this.tutorId) {
      params.tutorId = this.tutorId._id;
    }
    if (event.target.value) {
      this.earningStatsService.export(event.target.value, params);
    }
  }
}
