import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { AppointmentService } from '../../services/appointment.service';
import { TutorService } from '../../../tutor/tutor.service';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'app-appointment-listing',
  templateUrl: './listing.html'
})
export class AppointmentListingComponent implements OnInit {
  public count: Number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {};
  public nameTutor: String = '';
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public searching = false;
  public searchFailed = false;
  public tutorId: any;
  public userId: any;
  public service: any;
  public status: any;
  public dateChange: any;

  search = (text$: Observable<String>) =>
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
    );

  formatter = (x: { name: String }) => x.name;

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private toasty: ToastrService,
    private tutorService: TutorService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.query();
  }

  onKeyup(ids: any) {
    if (ids === 'tutorId') {
      this.service = this.tutorService;
    } else if (ids === 'userId') {
      this.service = this.userService;
    }
  }

  query() {
    let params = Object.assign(
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
      params.startTime = this.dateChange.from;
      params.toTime = this.dateChange.to;
    }

    this.appointmentService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.items = resp.data.items;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this user?')) {
      this.appointmentService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }

  dateChangeEvent(dateChange: any) {
    if (!dateChange) {
      return this.toasty.error('Something went wrong, please try again.');
    }
    this.dateChange = dateChange;
  }

  cancelEvent(item: any, index) {
    if (!item && item.status !== 'canceled') {
      return this.toasty.error('Something went wrong, please try again.');
    }
    this.items[index].status = 'canceled';
  }
}
