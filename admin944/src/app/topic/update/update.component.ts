import { Component, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { SubjectService } from '../../subject/subject.service';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-topic-update',
  templateUrl: '../form.html'
})
export class TopicUpdateComponent implements OnInit {
  public topic: any = {};
  public isSubmitted: Boolean = false;
  private topicId: String;
  public categories: any = [];
  public subjects: any = [];
  constructor(
    private router: Router,
    private topicService: TopicService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.queryCategories();
    this.topicId = this.route.snapshot.paramMap.get('id');

    this.topicService.findOne(this.topicId).then(resp => {
      this.topic = _.pick(resp.data, ['name', 'alias', 'description', 'ordering', 'categoryIds', 'subjectIds']);
      if (this.topic.subjectIds && this.topic.categoryIds && this.topic.categoryIds.length) {
        this.querySubject(this.topic.categoryIds.join(','));
      }
    });
  }

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    this.isSubmitted = true;
    this.topicService
      .update(this.topicId, this.topic)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/topics/list']);
      })
      .catch(err => this.toasty.error(err.data.data.message || err.data.data.email));
  }

  queryCategories() {
    this.categoryService.search({ take: 100 }).then(
      resp => {
        this.categories = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  querySubject(categoryIds: string) {
    this.subjectService.search({ take: 100, categoryIds }).then(
      resp => {
        this.subjects = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  selectCategory(event) {
    if (event && event.length > 0) {
      this.topic.subjectIds = [];
      this.querySubject(this.topic.categoryIds.join(','));
    } else {
      this.subjects = [];
    }
  }
}
