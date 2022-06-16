import { Component, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../category/category.service';
import { SubjectService } from '../../subject/subject.service';

@Component({
  templateUrl: '../form.html'
})
export class TopicCreateComponent implements OnInit {
  public topic: any = {
    name: '',
    alias: '',
    description: '',
    ordering: 0,
    categoryIds: [],
    subjectIds: []
  };
  public isSubmitted: Boolean = false;
  public categories: any = [];
  public subjects: any = [];

  constructor(
    private router: Router,
    private topicService: TopicService,
    private toasty: ToastrService,
    private categoryService: CategoryService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.queryCategories();
  }

  submit(frm: any) {
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    this.isSubmitted = true;
    this.topicService.create(this.topic).then(
      () => {
        this.toasty.success('Topic has been created');
        this.router.navigate(['/topics/list']);
      },
      err => this.toasty.error(err.data.message || 'Something went wrong!')
    );
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
