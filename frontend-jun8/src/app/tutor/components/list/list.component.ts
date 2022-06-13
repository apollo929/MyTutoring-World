import { CountryService } from './../../../shared/services/country.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { TutorService } from '../../services/tutor.service';
import { GradeService } from '../../services/grade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SeoService, SubjectService, TopicService } from '../../../shared/services';
import { IUser, ISubject, ITopic } from '../../../user/interface';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  templateUrl: 'list.html'
})
export class TutorListComponent implements OnInit {
  public page: any = 1;
  public pageSize: number = 12;
  public tutors: IUser[] = [];
  public subjects: ISubject[] = [];
  public total: any = 0;
  public sort: any = '';
  public sortType: any = '';
  public countries: any;
  public showMoreFilter: boolean = false;

  public searchFields: any = {
    subjectIds: '',
    grade: '',
    categoryIds: '',
    countryCode: '',
    topicIds: ''
  };
  public grades: any = [];
  public loading: boolean = false;
  public timeout: any;
  public categories: any = [];
  public dateChange: any = {};
  public topics: ITopic[] = [];

  constructor(
    private tutorService: TutorService,
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService,
    private gradeService: GradeService,
    private authService: AuthService,
    private toasty: ToastrService,
    private countryService: CountryService,
    private subjectService: SubjectService,
    private topicService: TopicService,
    private translate: TranslateService
  ) {
    seoService.update('List tutor');
    // const data1 = this.route.snapshot.data['subjects'];
    // if (data1) {
    //   this.subjects = data1;
    // }
    const data = this.route.snapshot.data['search'];
    if (data) {
      this.tutors = data.items;
      this.total = data.count;
    }
    this.route.queryParams.subscribe(params => {
      this.searchFields = Object.assign(this.searchFields, params);
      if (this.searchFields.categoryIds) this.querySubjects();
      this.query();
    });
  }

  ngOnInit() {
    this.countries = this.countryService.getCountry();
    this.gradeService
      .search({
        take: 100,
        sort: 'ordering',
        sortType: 'asc'
      })
      .then(resp => {
        this.grades = resp.data.items;
      });
    this.categories = this.route.snapshot.data['categories'];
  }

  showMore() {
    this.showMoreFilter = !this.showMoreFilter;
  }

  query() {
    let params = Object.assign(
      {
        page: this.page,
        take: this.pageSize,
        sort: this.sort,
        sortType: this.sortType
      },
      this.searchFields,
      this.dateChange
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

  apply() {
    this.showMore();
    this.query();
  }
  gradeChange(event: any) {
    this.searchFields.grade = event.grade;
    this.page = 1;
    this.router.navigate(['/tutors'], {
      queryParams: {
        subjectId: this.searchFields.subjectId,
        grade: this.searchFields.grade,
        countryCode: this.searchFields.countryCode
      }
    });
    this.query();
  }
  subjectChange() {
    this.page = 1;
    // this.query();
    this.router.navigate(['/tutors'], {
      queryParams: {
        subjectId: this.searchFields.subjectId,
        grade: this.searchFields.grade,
        countryCode: this.searchFields.countryCode
      }
    });
    this.query();
  }
  dateChangeEvent(dateChange: any) {
    if (!dateChange) {
      return this.toasty.error(this.translate.instant('Something went wrong, please try again.'));
    }

    this.dateChange = {
      startTime: dateChange.from,
      toTime: dateChange.to
    };

    this.query();
  }

  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    this.query();
  }

  selectCategory() {
    if (this.searchFields.categoryIds) {
      this.querySubjects();
    } else {
      this.searchFields.subjectIds = [];
      this.searchFields.topicIds = [];
      this.subjects = [];
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

  selectSubject() {
    if (this.searchFields.subjectIds) {
      this.queryTopic();
    } else {
      this.searchFields.topicIds = [];
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
}
