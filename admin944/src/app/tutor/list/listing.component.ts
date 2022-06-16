import { Component, OnInit } from '@angular/core';
import { TutorService } from '../tutor.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../../subject/subject.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-tutor-listing',
  templateUrl: './listing.html'
})
export class TutorListingComponent implements OnInit {
  public count: Number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {
    rating: '',
    status: ''
  };
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public subjects = [];
  public subjectIds: any;
  public updating: Boolean = false;

  constructor(
    private router: Router,
    private tutorService: TutorService,
    private toasty: ToastrService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.query();
    this.querySubjects();
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
    if (this.subjectIds) {
      params.subjectId = this.subjectIds.toString();
    }
    this.tutorService
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

  querySubjects() {
    this.subjectService.search({ take: 100 }).then(resp => {
      this.subjects = resp.data.items;
    });
  }

  remove(item: any, index: number) {
    if (window.confirm('Are you sure want to delete this tutor?')) {
      this.tutorService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }
  update(tutor: any, field: string, value: Boolean) {
    const data = _.pick(tutor, [
      'name',
      'username',
      'subjectIds',
      'bio',
      'email',
      'isActive',
      'emailVerified',
      'address',
      'emailNotification',
      'phoneNumber',
      'phoneVerified',
      'grades',
      'languages',
      'password',
      'isHomePage',
      'zipCode'
    ]);
    data[field] = value;
    if (!this.updating) {
      this.updating = true;
      this.tutorService
        .update(tutor._id, data)
        .then(resp => {
          tutor[field] = value;
          this.toasty.success('Updated successfuly!');
          this.updating = false;
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error('Something went wrong, please check and try again!');
        });
    }
  }

  changeStatus(tutor) {
    if (!this.updating) {
      this.updating = true;
      this.tutorService
        .changeStatus(tutor._id)
        .then(resp => {
          tutor['isActive'] = !tutor.isActive;
          const message = tutor.isActive ? 'Activated' : 'Deactivated';
          this.toasty.success(message);
          this.updating = false;
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error('Something went wrong, please check and try again!');
        });
    }
  }
}
