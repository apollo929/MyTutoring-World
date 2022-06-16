import { Component, OnInit, Input } from '@angular/core';
import { SubjectService } from '../subject.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';

@Component({
  selector: 'app-subject-listing',
  templateUrl: './listing.html'
})
export class SubjectListingComponent implements OnInit {
  @Input() categoryIds: string;
  public count: number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public updating: boolean = false;

  constructor(private router: Router, private subjectService: SubjectService, private toasty: ToastrService) {}

  ngOnInit() {
    if (this.categoryIds) {
      this.searchFields.categoryIds = this.categoryIds;
    }
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
    this.subjectService
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
    if (window.confirm('Are you sure want to delete this subject?')) {
      this.subjectService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.count--;
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }

  update(subject: any) {
    const sub = pick(subject, ['name', 'alias', 'categoryIds', 'isActive']);
    sub.isActive = !subject.isActive;
    if (!this.updating) {
      this.updating = true;
      this.subjectService
        .update(subject._id, sub)
        .then(resp => {
          subject.isActive = sub.isActive;
          this.updating = false;
          if (sub.isActive) this.toasty.success('Activated!');
          else this.toasty.success('Deactivated!');
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error(err.data.data.message);
        });
    }
  }
}
