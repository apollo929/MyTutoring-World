import { Component, OnInit, Input } from '@angular/core';
import { TopicService } from '../topic.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';

@Component({
  selector: 'app-topic-listing',
  templateUrl: './list.html'
})
export class TopicListingComponent implements OnInit {
  @Input() subjectIds: string;
  public count: number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'ordering',
    sortType: 'asc'
  };
  public updating: boolean = false;

  constructor(private router: Router, private topicService: TopicService, private toasty: ToastrService) {}

  ngOnInit() {
    if (this.subjectIds) {
      this.searchFields.subjectIds = this.subjectIds;
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
    this.topicService
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
    if (window.confirm('Are you sure want to delete this topic?')) {
      this.topicService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.count--;
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }

  update(topic: any) {
    const t = pick(topic, ['name', 'alias', 'categoryIds', 'isActive', 'subjectIds']);
    t.isActive = !topic.isActive;
    if (!this.updating) {
      this.updating = true;
      this.topicService
        .update(topic._id, t)
        .then(resp => {
          topic.isActive = t.isActive;
          this.updating = false;
          if (topic.isActive) this.toasty.success('Activated!');
          else this.toasty.success('Deactivated!');
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error(err.data.data.message);
        });
    }
  }
}
