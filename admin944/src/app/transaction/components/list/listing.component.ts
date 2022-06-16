import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../shared/services';
import { TutorService } from '../../../tutor/tutor.service';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'app-transaction-listing',
  templateUrl: './listing.html'
})
export class TransactionListComponent implements OnInit {
  public count: Number = 0;
  public transaction = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = { targetType: '', status: '' };
  public dateChange: any;
  public status: any;
  public tutorId: any;
  public userId: any;
  public searching = false;
  public searchFailed = false;
  public service: any;
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public config: any;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.service
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
    private router: Router,
    private authService: AuthService,
    private transactionService: TransactionService,
    private toasty: ToastrService,
    private tutorService: TutorService,
    private userService: UserService,
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
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`
      },
      this.searchFields
    );
    if (this.status) {
      params.status = this.status;
    }

    if (this.tutorId) {
      params.tutorId = this.tutorId._id;
    }

    if (this.userId) {
      params.userId = this.userId._id;
    }
    if (this.dateChange) {
      params.startTime = new Date(this.dateChange.from).toISOString();
      params.toTime = new Date(this.dateChange.to).toISOString();
    }
    this.transactionService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.transaction = resp.data.items;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }
  keyPress(event: any) {
    if (event.charCode === 13) {
      this.query();
    }
  }

  onKeyup(ids: any) {
    if (ids === 'tutorId') {
      this.service = this.tutorService;
    } else if (ids === 'userId') {
      this.service = this.userService;
    }
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
    this.dateChange = dateChange;
  }
}
