import { TutorService } from './../../tutor/tutor.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebinarService } from '../webinar.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../category/category.service';
import { CalendarService } from '../../calendar/services/calendar.service';
import { randomHash, responseError } from '../../shared/util';
import { from, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { GradeService } from '../../grade/grade.service';
import { MyCategoryService } from '../../shared/services/my-category.service';
import { MyTopicService } from '../../shared/services/my-topic.service';
import { MySubjectService } from '../../shared/services/my-subject.service';
@Component({
  templateUrl: './create.html'
})
export class WebinarCreateComponent implements OnInit, OnDestroy {
  public maxFileSize: number;
  public webinar: any = {
    name: '',
    maximumStrength: 1,
    categoryIds: [],
    isOpen: false,
    price: 0,
    mediaIds: [],
    mainImageId: '',
    description: '',
    featured: false,
    isFree: false,
    subjectIds: [],
    topicIds: []
  };
  public count: Number = 0;
  public items = [];
  public grades: any = [];
  public categories: any = [];
  public isSubmitted: Boolean = false;
  public mediaOptions: any;
  public mainImageOptions: any;
  public medias: any = [];
  public mainImageUrl: String = '';
  public hashWebinar: any;
  public quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean']
        // ['image']
      ]
    },
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          }
        }
      }
    }
  };
  public searching = false;
  public searchFailed: any = {
    categoryIds: '',
    gradeIds: ''
  };
  public imageSelected: any[] = [];
  public filesSelected: any[] = [];

  public myCategories: any[] = [];
  public mySubjects: any[] = [];
  public myTopics: any[] = [];
  public filterMyCategory: any = {
    currentPage: 1,
    pageSize: 100,
    sortOption: {
      sortBy: 'ordering',
      sortType: 'asc'
    },
    total: 0,
    loading: false
  };
  public filterMySubject: any = {
    currentPage: 1,
    pageSize: 100,
    sortOption: {
      sortBy: 'ordering',
      sortType: 'asc'
    },
    myCategoryIds: '',
    total: 0,
    loading: false
  };

  public filterMyTopic: any = {
    currentPage: 1,
    pageSize: 100,
    sortOption: {
      sortBy: 'ordering',
      sortType: 'asc'
    },
    mySubjectIds: '',
    total: 0,
    loading: false
  };

  public tutorTz = '';
  search = (text$: Observable<String>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.tutorService
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
      // tslint:disable-next-line:semicolon
    );
  formatter = (x: { name: String }) => x.name;
  constructor(
    private router: Router,
    private webinarService: WebinarService,
    private toasty: ToastrService,
    private gradeService: GradeService,
    private categoryService: CategoryService,
    private calendarService: CalendarService,
    private tutorService: TutorService,
    private myCategoryService: MyCategoryService,
    private myTopicService: MyTopicService,
    private mySubjectService: MySubjectService
  ) {
    this.maxFileSize = window.appConfig.maximumFileSize;
  }

  ngOnInit() {
    this.mainImageOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.webinar.mainImageId = resp.data._id;
        this.mainImageUrl = resp.data.thumbUrl;
      },
      onFileSelect: resp => (this.imageSelected = resp),
      accept: 'image/*'
    };
    this.mediaOptions = {
      url: window.appConfig.apiBaseUrl + '/media/files',
      fileFieldName: 'file',
      onFinish: resp => {
        this.webinar.mediaIds.push(resp.data._id);
        this.medias.push(resp.data);
      },
      onFileSelect: resp => (this.filesSelected = resp)
    };
    // this.queryCategories();
    this.hashWebinar = localStorage.getItem('hast_webinar');
    if (!this.hashWebinar) {
      this.hashWebinar = randomHash(32, '');
      localStorage.setItem('hast_webinar', this.hashWebinar);
    }
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

  ngOnDestroy() {
    if (this.hashWebinar) {
      this.calendarService.deleteByHash(this.hashWebinar);
      localStorage.removeItem('hast_webinar');
    }
  }

  queryCategories() {
    this.categoryService.search({ take: 100 }).then(
      resp => {
        this.categories = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  removeMedia(i: any) {
    this.webinar.mediaIds.splice(i, 1);
    this.medias.splice(i, 1);
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }
    if (!this.webinar.mainImageId) return this.toasty.error('Please upload main image for webinar!');
    this.calendarService.checkByHash(this.hashWebinar).then(check => {
      if (!check.data.success && this.webinar.isOpen) {
        return this.toasty.error('Please create schedule for group class if you want the class to be public');
      }
      const data = this.hashWebinar ? Object.assign(this.webinar, { hashWebinar: this.hashWebinar }) : this.webinar;
      this.webinarService.create(data).then(
        resp => {
          localStorage.removeItem('hast_webinar');
          this.toasty.success('Webinar has been created');
          this.router.navigate(['/webinars/update/' + resp.data._id]);
        },
        err => this.toasty.error(responseError(err))
      );
    });
  }
  selectTutor(event) {
    this.webinar.tutorId = event.item._id;
    this.tutorService.findOne(this.webinar.tutorId).then(resp => {
      this.tutorTz = resp.data.timezone;
    });
    this.queryMyCategories();
  }

  queryMyCategories() {
    this.filterMyCategory.loading = true;
    const params = Object.assign({
      page: this.filterMyCategory.currentPage,
      take: this.filterMyCategory.pageSize,
      sort: `${this.filterMyCategory.sortOption.sortBy}`,
      sortType: `${this.filterMyCategory.sortOption.sortType}`,
      tutorId: this.webinar.tutorId
    });
    this.myCategoryService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMyCategory.total = resp.data.count;
          this.myCategories = resp.data.items;
        }
        this.filterMyCategory.loading = false;
      })
      .catch(err => {
        this.filterMyCategory.loading = false;
        return this.toasty.error(
          err.data && err.data.data && err.data.data.message
            ? err.data.data.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  onSelectMyCategories(items) {
    if (items && items.length) {
      const ids = items.map(item => item._id);
      this.filterMySubject.myCategoryIds = ids.join(',');
      this.queryMySubjects();
    } else {
      this.mySubjects = [];
      this.myTopics = [];
      this.webinar.subjectIds = [];
      this.webinar.topicIds = [];
    }
  }

  queryMySubjects() {
    this.filterMySubject.loading = true;
    const params = Object.assign({
      page: this.filterMySubject.currentPage,
      take: this.filterMySubject.pageSize,
      sort: `${this.filterMySubject.sortOption.sortBy}`,
      sortType: `${this.filterMySubject.sortOption.sortType}`,
      myCategoryIds: this.filterMySubject.myCategoryIds,
      tutorId: this.webinar.tutorId
    });
    this.mySubjectService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMySubject.total = resp.data.count;
          this.mySubjects = resp.data.items;
          const mySubjectSelected = this.mySubjects.filter(
            item => this.webinar.subjectIds.indexOf(item.originalSubjectId) > -1
          );
          this.webinar.subjectIds = mySubjectSelected.map(item => item.originalSubjectId);
          this.filterMyTopic.mySubjectIds = mySubjectSelected.map(item => item._id).join(',');
          this.queryMyTopics();
        }
        this.filterMySubject.loading = false;
      })
      .catch(err => {
        this.filterMySubject.loading = false;
        return this.toasty.error(
          err.data && err.data.data && err.data.data.message
            ? err.data.data.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  onSelectMySubjects(items) {
    if (items && items.length) {
      const ids = items.map(item => item._id);
      this.filterMyTopic.mySubjectIds = ids.join(',');
      this.queryMyTopics();
    } else {
      this.myTopics = [];
      this.webinar.topicIds = [];
    }
  }

  queryMyTopics() {
    this.filterMyTopic.loading = true;
    const params = Object.assign({
      page: this.filterMyTopic.currentPage,
      take: this.filterMyTopic.pageSize,
      sort: `${this.filterMyTopic.sortOption.sortBy}`,
      sortType: `${this.filterMyTopic.sortOption.sortType}`,
      mySubjectIds: this.filterMyTopic.mySubjectIds,
      tutorId: this.webinar.tutorId
    });
    this.myTopicService
      .search(params)
      .then(resp => {
        this.filterMyTopic.loading = false;
        if (resp.data && resp.data.items) {
          this.filterMyTopic.total = resp.data.count;
          this.myTopics = resp.data.items;
          const myTopicSelected = this.myTopics.filter(
            item => this.webinar.topicIds.indexOf(item.originalTopicId) > -1
          );
          this.webinar.topicIds = myTopicSelected.map(item => item.originalTopicId);
        }
      })
      .catch(err => {
        this.filterMyTopic.loading = true;
        return this.toasty.error(
          err.data && err.data.data && err.data.data.message
            ? err.data.data.message
            : 'Something went wrong, please try again!'
        );
      });
  }
}
