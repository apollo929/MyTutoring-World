import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import {
  CategoryService,
  MySubjectService,
  MyCategoryService,
  MyTopicService
} from '../../../../shared/services';
import { CourseService } from 'app/shared/services/course.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CalendarService } from '../../../../calendar/services/calendar.service';
import { ICourse } from '../../../../course/interface';
import { ICategory } from '../../../../categories/interface';
import { GradeService } from '../../../../tutor/services/grade.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLectureSection } from '../modal-lecture-section/modal-lecture-section';
@Component({
  selector: 'app-course-update',
  templateUrl: '../form.html'
})
export class CourseUpdateComponent implements OnInit {

  @ViewChild('c_goals_a') c_goals_a: ElementRef<HTMLElement>
  @ViewChild('c_coupon_a') c_coupon_a: ElementRef<HTMLElement>
  @ViewChild('c_details_a') c_details_a: ElementRef<HTMLElement>
  @ViewChild('basicInfo_a') basicInfo_a: ElementRef<HTMLElement>

  changeTab(name) {
    let el: HTMLElement = this[name].nativeElement;
    el.click();
  }


  public maxFileSize: number;
  public tab: string = 'basicInfo';
  public loading: boolean = false;
  public course: ICourse = {};
  public courseFrom: ICourse = {
    name: '',
    maximumStrength: 1,
    categoryIds: [],
    isOpen: false,
    price: 0,
    mediaIds: [],
    mainImageId: '',
    description: '',
    alias: '',
    isFree: false,
    gradeIds: [],
    subjectIds: [],
    topicIds: []
  };
  public isSubmitted: Boolean = false;
  public courseId: string;
  public categories: ICategory[] = [];
  public medias: any = [];
  public mediaOptions: any;
  public mainImageOptions: any;
  public mainImageUrl: String = '';
  public Editor = ClassicEditor;
  public hashCourse: any;
  public imageSelected: any[] = [];
  public filesSelected: any[] = [];
  public config: any;

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
  public grades: any[] = [];

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

  public myCategorySelectedIds: any[] = [];
  public mySubjectSelectedIds: any[] = [];

  constructor(
    private router: Router,
    private courseService: CourseService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private calendarService: CalendarService,
    private gradeService: GradeService,
    private myCategoryService: MyCategoryService,
    private myTopicService: MyTopicService,
    private mySubjectService: MySubjectService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.maxFileSize = window.appConfig.maximumFileSize;
    this.config = this.route.snapshot.data['appConfig'];

    setTimeout(() => {
      if (localStorage.getItem("from") == "create") {
        localStorage.removeItem("from");
        // this.onTabSelect('c_goals')
        let el: HTMLElement = this.c_goals_a.nativeElement;
        el.click();
      }
    }, 300);

  }

  ngOnInit() {
    this.loading = true;
    this.courseId = this.route.snapshot.paramMap.get('id');

    this.queryGrades();
    this.courseService
      .findOne(this.courseId)
      .then(resp => {
        if (resp.data.media && resp.data.media.length) {
          this.medias = resp.data.media;
        }
        this.mainImageUrl = resp.data.mainImage.thumbUrl;
        this.course = resp.data;
        this.loading = false;
        this.queryMyCategories(true);
      })
      .catch(e => {
        this.loading = false;
        this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
      });
    this.mainImageOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.course.mainImageId = resp.data._id;
        this.mainImageUrl = resp.data.thumbUrl;
      },
      onFileSelect: resp => (this.imageSelected = resp),
      accept: 'image/*',
      id: 'image-upload'
    };
    this.mediaOptions = {
      url: window.appConfig.apiBaseUrl + '/media/files',
      fileFieldName: 'file',
      onFinish: resp => {
        this.course.mediaIds.push(resp.data._id);
        this.medias.push(resp.data);
      },
      onFileSelect: resp => (this.filesSelected = resp),
      id: 'file-upload'
    };
  }

  removeMedia(i: any) {
    this.course.mediaIds.splice(i, 1);
    this.medias.splice(i, 1);
  }

  queryCategories() {
    this.loading = true;
    this.categoryService
      .search({ take: 100, sort: 'ordering', sortType: 'asc' })
      .then(resp => {
        this.categories = resp.data.items;
        this.loading = false;
      })
      .catch(er => {
        this.loading = false;
        this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
      });
  }
  queryGrades() {
    this.loading = true;
    this.gradeService
      .search({ take: 100, sort: 'ordering', sortType: 'asc' })
      .then(resp => {
        this.grades = resp.data.items;
        this.loading = false;
      })
      .catch(er => {
        this.loading = false;
        this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
      });
  }
  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid) {
      return this.toasty.error(this.translate.instant('Invalid form, please try again.'));
    }
    if (this.course.price <= 0 && !this.course.isFree) {
      return this.toasty.error(this.translate.instant('Price value should be greater than 0'));
    }
    if (this.course.isFree === true) this.course.price = 0;
    if (this.course.mediaIds.length < 1) {
      return this.toasty.error(this.translate.instant('Please upload course introduction video!'));
    }
    if (!this.course.mainImageId)
      return this.toasty.error(this.translate.instant('Please upload main image for course!'));

    if (this.course.description) {
      this.course.description = this.course.description.replace(
        '<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>',
        ''
      );
    }

    this.courseFrom = {
      name: this.course.name,
      maximumStrength: this.course.maximumStrength,
      categoryIds: this.course.categoryIds,
      isOpen: this.course.isOpen,
      price: this.course.price,
      mediaIds: this.course.mediaIds,
      mainImageId: this.course.mainImageId,
      description: this.course.description,
      alias: this.course.alias,
      isFree: this.course.isFree,
      gradeIds: this.course.gradeIds,
      subjectIds: this.course.subjectIds,
      topicIds: this.course.topicIds
    }

    this.loading = true;

    this.courseService.update(this.course._id, this.courseFrom).then(resp => {
      this.loading = false;
      this.changeTab('c_goals_a')
    }).catch(er => {
      this.loading = false;
      this.toasty.error(this.translate.instant('Something went wrong, please try again!'));
    });

  }
  onTabSelect(tab: string) {
    this.tab = tab;
  }

  async queryMyCategories(init: boolean = false) {
    this.filterMyCategory.loading = true;
    const params = Object.assign({
      page: this.filterMyCategory.currentPage,
      take: this.filterMyCategory.pageSize,
      sort: `${this.filterMyCategory.sortOption.sortBy}`,
      sortType: `${this.filterMyCategory.sortOption.sortType}`,
      tutorId: this.course.tutorId
    });
    this.myCategoryService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMyCategory.total = resp.data.count;
          this.myCategories = resp.data.items;
          if (init) {
            const myCategorySelected = this.myCategories.filter(
              item => this.course.categoryIds.indexOf(item.originalCategoryId) > -1
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
          this.translate.instant(
            err.data && err.data.data && err.data.data.message
              ? err.data.data.message
              : 'Something went wrong, please try again!'
          )
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
      this.course.subjectIds = [];
      this.course.topicIds = [];
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
      tutorId: this.course.tutorId
    });
    this.mySubjectService
      .search(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMySubject.total = resp.data.count;
          this.mySubjects = resp.data.items;
          const mySubjectSelected = this.mySubjects.filter(
            item => this.course.subjectIds.indexOf(item.originalSubjectId) > -1
          );
          this.course.subjectIds = mySubjectSelected.map(item => item.originalSubjectId);
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
          this.translate.instant(
            err.data && err.data.data && err.data.data.message
              ? err.data.data.message
              : 'Something went wrong, please try again!'
          )
        );
      });
  }

  async onSelectMySubjects(items) {
    if (items && items.length) {
      const ids = items.map(item => item._id);
      this.queryMyTopics(ids.join(','));
    } else {
      this.myTopics = [];
      this.course.topicIds = [];
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
      tutorId: this.course.tutorId
    });
    this.myTopicService
      .search(params)
      .then(resp => {
        this.filterMyTopic.loading = false;
        if (resp.data && resp.data.items) {
          this.filterMyTopic.total = resp.data.count;
          this.myTopics = resp.data.items;
          const myTopicSelected = this.myTopics.filter(
            item => this.course.topicIds.indexOf(item.originalTopicId) > -1
          );
          this.course.topicIds = myTopicSelected.map(item => item.originalTopicId);
        }
      })
      .catch(err => {
        this.filterMyTopic.loading = true;
        return this.toasty.error(
          this.translate.instant(
            err.data && err.data.data && err.data.data.message
              ? err.data.data.message
              : 'Something went wrong, please try again!'
          )
        );
      });
  }



}
