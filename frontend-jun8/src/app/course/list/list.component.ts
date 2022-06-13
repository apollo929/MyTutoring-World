import { SeoService } from '../../shared/services/seo.service';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ICourse } from '../interface';
import { GradeService } from '../../tutor/services/grade.service';
import { ICategory } from '../../categories/interface';
import { ISubject, ITopic } from '../../user/interface';
import { SubjectService, TopicService } from '../../shared/services';
import { TranslateService } from '@ngx-translate/core';

declare var jQuery: any;
@Component({
  selector: 'course-listing',
  templateUrl: './list.html'
})
export class CourseListingComponent implements OnInit {
  public page: any = 1;
  public totalCourses: Number = 0;
  public items: ICourse[] = [];
  public item1: ICourse = null;
  public currentPage: Number = 1;
  public pageSize: Number = 12;
  public searchFields: any = {
    categoryIds: '',
    gradeIds: '',
    subjectIds: '',
    topicIds: ''
  };
  public grades: any[] = [];
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public;
  public queryParams: any;
  public timeout: any;
  public loading: boolean = false;
  public categories: ICategory[] = [];
  public itemChunks: ICourse[][] = [];
  public dateChange: any = {};
  public config: any;
  public subjects: ISubject[] = [];
  public topics: ITopic[] = [];
  constructor(
    private courseService: CourseService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private gradeService: GradeService,
    private subjectService: SubjectService,
    private topicService: TopicService,
    private translate: TranslateService
  ) {
    seoService.update('List Group Classes');
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.categories = this.route.snapshot.data['categories'];
    this.queryParams = this.route.snapshot.queryParams;
    this.query();
    this.gradeService
      .search({
        take: 100,
        sort: 'ordering',
        sortType: 'asc'
      })
      .then(resp => {
        this.grades = resp.data.items;
      });
  }

  query() {
    this.loading = true;
    const params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`,
        isOpen: true,
        disabled: false
      },
      this.searchFields,
      this.dateChange
    );
    this.courseService
      .search(params)
      .then(resp => {
        this.totalCourses = resp.data.count;
        this.items = resp.data.items;
        this.itemChunks = _.chunk(this.items, 6);
        this.item1 = this.itemChunks.length && this.itemChunks[0].length ? this.itemChunks[0][0] : null;

        // if (this.item1) {
        //   this.courseService
        //     .getLatest(this.item1._id)
        //     .then(res => {
        //       if (res.data && res.data.latest) this.item1.latestSlot = res.data.latest;
        //     })
        //     .catch(e => {
        //       this.toasty.error(this.translate.instant('asdf something went wrong!'));
        //     });
        // }
        this.loading = false;
        (function ($) {
          $(document).ready(function () {
            const showChar = 150; // How many characters are shown by default
            const ellipsestext = '...';
            const moretext = 'Read More...';
            let content = '';
            $('.more1').each(function () {
              content = $(this).text();
              if (content.length > showChar) {
                const c = content.substr(0, showChar);
                const html =
                  c +
                  '<span class="moreellipses">' +
                  ellipsestext +
                  '&nbsp;</span>' +
                  `</span>&nbsp;&nbsp;` +
                  '</span>';
                $(this).html(html);
              }
            });
          });
        })(jQuery);
      })
      .catch(e => {
        this.loading = false;
        alert('Something went wrong, please try again!');
      });
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  sortPrice(evt) {
    const value = evt.target.value;
    if (value) {
      this.sortOption.sortBy = 'price';
      this.sortOption.sortType = value;
    } else {
      this.sortOption = {
        sortBy: 'createdAt',
        sortType: 'desc'
      };
    }
    this.query();
  }

  doSearch(evt) {
    const searchText = evt.target.value; // this is the search text
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(() => {
      this.searchFields.name = searchText;
      this.query();
    }, 400);
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
  gradeChange(event: any) {
    this.page = 1;
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
