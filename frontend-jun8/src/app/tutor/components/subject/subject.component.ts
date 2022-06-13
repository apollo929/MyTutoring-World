import { SubjectService } from './../../../shared/services/subject.service';
import { ICategory } from './../../../categories/interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService, SeoService, TopicService } from '../../../shared/services';
import { TutorService } from '../../services/tutor.service';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  templateUrl: './subject.html'
})
export class SubjectComponent implements OnInit {
  public subjects: any[] = [];
  public topics: any[] = [];
  public categories: any[];
  public sort: any = '';
  public sortType: any = '';
  public page = 1;
  public pageSize: number = 12;
  public tutors: any = [];
  public total: any = 0;
  public searchFields: any = {
    categoryIds: '',
    subjectIds: '',
    topicIds: ''
  };
  public loading: boolean = false;
  public category: any;
  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private tutorService: TutorService,
    private seoService: SeoService,
    private router: Router,
    private topicService: TopicService,
    private subjectService: SubjectService,
    private translate: TranslateService
  ) {
    this.seoService.update('Enjoy lessons with a professional online tutors');
    this.categories = this.route.snapshot.data['categories'];
    this.route.queryParams.subscribe(params => {
      this.category = this.categories.filter(item => item.alias === params.category);
      const filter = {
        categoryIds: this.category && this.category.length ? this.category[0]._id : ''
      };
      this.searchFields = Object.assign(this.searchFields, filter);
      this.querySubjects();
      this.query();
      this.querySubjects();
    });
  }

  ngOnInit() {
    // this.subjects = this.route.snapshot.data['subjects'];
  }

  query() {
    let params = Object.assign(
      {
        page: this.page,
        take: this.pageSize,
        sort: this.sort,
        sortType: this.sortType
      },
      this.searchFields
    );
    if (!this.loading) {
      this.loading = true;
      this.tutorService
        .search(params)
        .then(resp => {
          this.total = resp.data.count;
          this.tutors = resp.data.items;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          alert(this.translate.instant('Something went wrong, please try again!'));
        });
    }
  }

  subjectChange() {
    this.page = 1;
    const subject = this.subjects.filter(item => item._id === this.searchFields.subjectId);
    const queryParams = {
      subject: subject && subject.length ? subject[0].alias : ''
    };
    this.router.navigate(['/tutors/subject'], {
      queryParams: queryParams
    });
    this.query();
  }

  getLangName(key: string) {
    return this.languageService.getLangName(key);
  }

  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    this.query();
  }

  selectCategory() {
    if (this.searchFields.categoryIds) {
      this.category = this.categories.filter(item => item._id === this.searchFields.categoryIds);
      this.querySubjects();
    } else {
      this.category = null;
      this.searchFields.subjectIds = [];
      this.searchFields.topicIds = [];
      this.subjects = [];
      this.topics = [];
    }
    this.query();
  }

  queryTopic() {
    this.topicService.search({ subjectIds: this.searchFields.subjectIds, take: 1000, isActive: true }).then(resp => {
      if (resp.data && resp.data.items && resp.data.items.length > 0) {
        this.topics = resp.data.items;
      } else {
        this.topics = [];
      }
    });
  }

  selectSubject() {
    if (this.searchFields.subjectIds) {
      this.queryTopic();
    } else {
      this.searchFields.topicIds = [];
      this.topics = [];
    }
    this.query();
  }

  querySubjects() {
    this.subjectService
      .search({ categoryIds: this.searchFields.categoryIds, take: 1000, isActive: true })
      .then(resp => {
        if (resp.data && resp.data.items && resp.data.items.length > 0) {
          this.subjects = resp.data.items;
        } else {
          this.subjects = [];
        }
      });
  }
}
