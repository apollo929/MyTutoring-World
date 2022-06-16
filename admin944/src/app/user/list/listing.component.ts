import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-listing',
  templateUrl: './listing.html'
})
export class UserListingComponent implements OnInit {
  public count: number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {
    name: '',
    email: '',
    isActive: '',
    emailVerified: ''
  };
  public updating: boolean = false;
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(private router: Router, private userService: UserService, private toasty: ToastrService) {}

  ngOnInit() {
    this.query();
  }

  query() {
    // tslint:disable-next-line:prefer-const
    let params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: this.sortOption.sortBy,
        sortType: this.sortOption.sortType,
        role: 'user',
        type: 'student'
      },
      this.searchFields
    );
    this.userService
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
      this.userService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.count = this.count - 1;
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }
  update(user: any, field: string, value: Boolean) {
    const data = _.pick(user, ['isActive', 'emailVerified']);

    data[field] = value;
    if (!this.updating) {
      this.updating = true;
      this.userService
        .update(user._id, data)
        .then(resp => {
          user[field] = value;
          this.toasty.success('Updated successfuly!');
          this.updating = false;
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error('Something went wrong, please check and try again!');
        });
    }
  }
}
