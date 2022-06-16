import { TutorService } from './../../tutor/tutor.service';
import { Component, OnInit } from '@angular/core';
import { WebinarService } from '../webinar.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../category/category.service';
import { GradeService } from '../../grade/grade.service';
import * as _ from 'lodash';
import { CalendarService } from '../../calendar/services/calendar.service';
import { MyCategoryService } from '../../shared/services/my-category.service';
import { MyTopicService } from '../../shared/services/my-topic.service';
import { MySubjectService } from '../../shared/services/my-subject.service';
@Component({
  selector: 'app-webinar-update',
  templateUrl: './update.html'
})
export class WebinarUpdateComponent implements OnInit {
  public maxFileSize: number;
  public webinar: any = {};
  public isSubmitted: Boolean = false;
  public webinarId: String;
  public grades: any = [];
  public categories: any = [];
  public medias: any = [];
  public mediaOptions: any;
  public mainImageOptions: any;
  public mainImageUrl: String = '';
  public tutorId: any;
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

  public myCategorySelectedIds: any[] = [];
  public mySubjectSelectedIds: any[] = [];
  constructor(
    private router: Router,
    private webinarService: WebinarService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private gradeService: GradeService,
    private calendarService: CalendarService,
    private myCategoryService: MyCategoryService,
    private myTopicService: MyTopicService,
    private mySubjectService: MySubjectService,
    private tutorService: TutorService
  ) {
    this.maxFileSize = window.appConfig.maximumFileSize;
  }

  ngOnInit() {
    this.webinarId = this.route.snapshot.paramMap.get('id');
    this.queryGrades();
    this.webinarService.findOne(this.webinarId).then(resp => {
      this.medias = resp.data.media;
      this.mainImageUrl = resp.data.mainImage.fileUrl;
      this.tutorId = resp.data.tutorId;
      this.tutorService.findOne(this.tutorId).then(resp => {
        this.tutorTz = resp.data.timezone;
      });
      this.webinar = _.pick(resp.data, [
        'name',
        'maximumStrength',
        'categoryIds',
        'isOpen',
        'price',
        'mediaIds',
        'mainImageId',
        'description',
        'featured',
        'tutorId',
        'tutor',
        'gradeIds',
        'isFree',
        'subjectIds',
        'topicIds'
      ]);
      this.queryMyCategories(true);
      // this.queryMySubjects(this.myCategorySelectedIds);
      // this.queryMyTopics(this.mySubjectSelectedIds);
    });
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
  }

  removeMedia(i: any) {
    this.webinar.mediaIds.splice(i, 1);
    this.medias.splice(i, 1);
  }

  queryCategories() {
    this.categoryService.search({ take: 100 }).then(
      resp => {
        this.categories = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  queryGrades() {
    this.gradeService.search({ take: 100 }).then(
      resp => {
        this.grades = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error('Invalid form, please try again.');
    }

    if (!this.webinar.mainImageId) return this.toasty.error('Please upload main image for webinar!');

    if (this.webinar.isFree === true) this.webinar.price = 0;
    this.calendarService.checkByWebinar(this.webinarId).then(check => {
      if (!check.data.success && this.webinar.isOpen) {
        return this.toasty.error('Please create schedule for group class if you want the class to be public');
      }
      this.webinarService
        .update(
          this.webinarId,
          _.pick(this.webinar, [
            'name',
            'maximumStrength',
            'categoryIds',
            'isOpen',
            'price',
            'mediaIds',
            'mainImageId',
            'description',
            'featured',
            'gradeIds',
            'isFree',
            'subjectIds',
            'topicIds'
          ])
        )
        .then(resp => {
          this.toasty.success('Updated successfuly!');
          this.router.navigate(['/webinars/list']);
        })
        .catch(err => this.toasty.error(err.data.message || err.data.email));
    });
  }

  async queryMyCategories(init: boolean = false) {
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
          if (init) {
            const myCategorySelected = this.myCategories.filter(
              item => this.webinar.categoryIds.indexOf(item.originalCategoryId) > -1
            );
            this.myCategorySelectedIds = myCategorySelected.map(item => item._id);
            this.queryMySubjects(this.myCategorySelectedIds.join(','), true);
          }
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
      this.queryMySubjects(ids.join(','));
    } else {
      this.mySubjects = [];
      this.myTopics = [];
      this.webinar.subjectIds = [];
      this.webinar.topicIds = [];
    }
  }

  async queryMySubjects(myCategoryIds, init: boolean = false) {
    this.filterMySubject.loading = true;
    const params = Object.assign({
      page: this.filterMySubject.currentPage,
      take: this.filterMySubject.pageSize,
      sort: `${this.filterMySubject.sortOption.sortBy}`,
      sortType: `${this.filterMySubject.sortOption.sortType}`,
      myCategoryIds: myCategoryIds,
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

          if (init) {
            this.mySubjectSelectedIds = mySubjectSelected.map(item => item._id);
            this.queryMyTopics(this.mySubjectSelectedIds.join(','));
          } else {
            this.queryMyTopics(this.filterMyTopic.mySubjectIds);
          }
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

  async onSelectMySubjects(items) {
    if (items && items.length) {
      const ids = items.map(item => item._id);
      this.queryMyTopics(ids.join(','));
    } else {
      this.myTopics = [];
      this.webinar.topicIds = [];
    }
  }

  queryMyTopics(mySubjectIds) {
    this.filterMyTopic.loading = true;
    const params = Object.assign({
      page: this.filterMyTopic.currentPage,
      take: this.filterMyTopic.pageSize,
      sort: `${this.filterMyTopic.sortOption.sortBy}`,
      sortType: `${this.filterMyTopic.sortOption.sortType}`,
      mySubjectIds: mySubjectIds,
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
