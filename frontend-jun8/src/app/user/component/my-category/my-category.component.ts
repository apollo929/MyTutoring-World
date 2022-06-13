import { IMyCategory, IMySubject, IMyTopic, ISubject, ITopic } from './../../interface';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  CategoryService,
  MyCategoryService,
  MySubjectService,
  MyTopicService,
  SubjectService,
  TopicService
} from '../../../shared/services';
import { ICategory } from '../../../categories/interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyCategoryFormComponent } from './modal-create-category/modal';
import { MySubjectFormComponent } from './modal-mysubject/my-subject';
import { MyTopicFormComponent } from './modal-create-topic/modal';
@Component({
  selector: 'app-my-category',
  templateUrl: './my-category.html'
})
export class MyCategoriesComponent implements OnInit {
  public categories: ICategory[] = [];
  public subjects: ISubject[] = [];
  public topics: ITopic[] = [];
  public myCategories: IMyCategory[] = [];
  public mySubjects: IMySubject[] = [];
  public myTopics: IMyTopic[] = [];
  public filterMyCategory: any = {
    currentPage: 1,
    pageSize: 10,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'desc'
    },
    total: 0,
    loading: false
  };

  public filterMySubject: any = {
    currentPage: 1,
    pageSize: 10,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'desc'
    },
    myCategoryId: '',
    total: 0,
    loading: false
  };

  public filterMyTopic: any = {
    currentPage: 1,
    pageSize: 10,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'desc'
    },
    mySubjectId: '',
    total: 0,
    loading: false
  };

  public tab: string = 'category';
  public checkMobileBrowser: boolean = false;
  public loading: boolean = false;
  public selectedCategory: IMyCategory;
  public selectedSubject: IMySubject;
  public config: any;

  constructor(
    private toasty: ToastrService,
    private categoryService: CategoryService,
    private myCategoryService: MyCategoryService,
    private subjectService: SubjectService,
    private mySubjectService: MySubjectService,
    private topicService: TopicService,
    private myTopicService: MyTopicService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.config = this.route.snapshot.data['appConfig'];
    this.categories = this.route.snapshot.data['categories'];
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.checkMobileBrowser = true;
    }
  }

  ngOnInit() {
    this.queryMyCategories();
  }

  queryCategories(params) {
    this.categoryService.getCategories({ ...params, take: 1000, isActive: true }).then(resp => {
      if (resp.data && resp.data.items && resp.data.items.length > 0) {
        this.categories = resp.data.items;
      }
    });
  }

  querySubjects() {
    this.subjectService
      .getSubjects({ categoryIds: this.selectedCategory._id, take: 1000, isActive: true })
      .then(resp => {
        if (resp.data && resp.data.items && resp.data.items.length > 0) {
          this.subjects = resp.data.items;
        }
      });
  }

  queryTopic(params) {
    this.topicService.getTopics({ ...params, take: 1000, isActive: true }).then(resp => {
      if (resp.data && resp.data.items && resp.data.items.length > 0) {
        this.topics = resp.data.items;
      }
    });
  }

  queryMyCategories() {
    this.filterMyCategory.loading = true;
    const params = Object.assign({
      page: this.filterMyCategory.currentPage,
      take: this.filterMyCategory.pageSize,
      sort: `${this.filterMyCategory.sortOption.sortBy}`,
      sortType: `${this.filterMyCategory.sortOption.sortType}`
    });
    this.myCategoryService
      .getListOfMe(params)
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

  queryMySubjects() {
    this.filterMySubject.loading = true;
    const params = Object.assign({
      page: this.filterMySubject.currentPage,
      take: this.filterMySubject.pageSize,
      sort: `${this.filterMySubject.sortOption.sortBy}`,
      sortType: `${this.filterMySubject.sortOption.sortType}`,
      myCategoryId: this.filterMySubject.myCategoryId
    });
    this.mySubjectService
      .getListOfMe(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMySubject.total = resp.data.count;
          this.mySubjects = resp.data.items;
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

  queryMyTopics() {
    this.filterMyTopic.loading = true;
    const params = Object.assign({
      page: this.filterMyTopic.currentPage,
      take: this.filterMyTopic.pageSize,
      sort: `${this.filterMyTopic.sortOption.sortBy}`,
      sortType: `${this.filterMyTopic.sortOption.sortType}`,
      mySubjectId: this.filterMyTopic.mySubjectId,
      myCategoryId: this.selectedCategory._id
    });
    this.myTopicService
      .getListOfMe(params)
      .then(resp => {
        if (resp.data && resp.data.items) {
          this.filterMyTopic.total = resp.data.count;
          this.myTopics = resp.data.items;
        }
        this.filterMyTopic.loading = false;
      })
      .catch(err => {
        this.filterMyTopic.loading = false;
        return this.toasty.error(
          err.data && err.data.data && err.data.data.message
            ? err.data.data.message
            : 'Something went wrong, please try again!'
        );
      });
  }

  pageChange(target) {
    $('html, body').animate({ scrollTop: 0 });
    if (target === 'category') {
      this.queryMyCategories();
    } else if (target === 'subject') {
      this.queryMySubjects();
    } else {
      this.queryMyTopics();
    }
  }

  sortBy(target: string, field: string, type: string) {
    if (target === 'category') {
      this.filterMyCategory.sortOption.sortBy = field;
      this.filterMyCategory.sortOption.sortType = type;
      this.queryMyCategories();
    } else if (target === 'subject') {
      this.filterMySubject.sortOption.sortBy = field;
      this.filterMySubject.sortOption.sortType = type;
      this.queryMySubjects();
    } else {
      this.filterMyTopic.sortOption.sortBy = field;
      this.filterMyTopic.sortOption.sortType = type;
      this.queryMyTopics();
    }
  }

  onSort(target, evt) {
    if (target === 'category') {
      this.filterMyCategory.sortOption = evt;
      this.queryMyCategories();
    } else if (target === 'subject') {
      this.filterMySubject.sortOption = evt;
      this.queryMySubjects();
    } else {
      this.filterMyTopic.sortOption = evt;
      this.queryMyTopics();
    }
  }

  onTabSelect(tab: string) {
    this.tab = tab;
  }

  submitCategory(myCategory = { isActive: true } as IMyCategory) {
    const modalRef = this.modalService.open(MyCategoryFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    modalRef.componentInstance.categories = this.categories;
    modalRef.componentInstance.myCategory = myCategory;
    modalRef.result.then(
      res => {
        if (myCategory._id) {
          this.myCategoryService
            .update(myCategory._id, Object.assign(res))
            .then(resp => {
              if (resp.data) {
                this.toasty.success('Updated successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        } else {
          this.myCategoryService
            .create(Object.assign(res))
            .then(resp => {
              if (resp.data) {
                this.myCategories.push(Object.assign(resp.data));
                this.toasty.success('Created successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        }
      },
      () => {}
    );
  }

  selectMyCategory(category: IMyCategory) {
    this.selectedCategory = category;
    this.selectedSubject = null;
    this.tab = 'subject';
    this.filterMySubject.myCategoryId = category._id;
    this.mySubjects = [];
    this.myTopics = [];
    this.queryMySubjects();
  }

  submitSubject(mySubject = { isActive: true } as IMySubject) {
    const modalRef = this.modalService.open(MySubjectFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    modalRef.componentInstance.selectedCategory = this.selectedCategory;
    modalRef.componentInstance.mySubject = mySubject;
    modalRef.result.then(
      res => {
        if (mySubject._id) {
          this.mySubjectService
            .update(mySubject._id, Object.assign(res, { myCategoryId: this.selectedCategory._id }))
            .then(resp => {
              if (resp.data) {
                this.toasty.success('Updated successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        } else {
          this.mySubjectService
            .create(Object.assign(res, { myCategoryId: this.selectedCategory._id }))
            .then(resp => {
              if (resp.data) {
                this.mySubjects.push(Object.assign(resp.data));
                this.toasty.success('Created successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        }
      },
      () => {}
    );
  }

  selectMySubject(subject: IMySubject) {
    this.selectedSubject = subject;
    this.tab = 'topic';
    this.filterMyTopic.mySubjectId = subject._id;
    this.myTopics = [];
    this.queryMyTopics();
  }

  submitTopic(myTopic = { isActive: true } as IMyTopic) {
    const modalRef = this.modalService.open(MyTopicFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    modalRef.componentInstance.selectedSubject = this.selectedSubject;
    modalRef.componentInstance.myTopic = myTopic;
    modalRef.result.then(
      res => {
        if (myTopic._id) {
          this.myTopicService
            .update(
              myTopic._id,
              Object.assign(res, { myCategoryId: this.selectedCategory._id, mySubjectId: this.selectedSubject._id })
            )
            .then(resp => {
              if (resp.data) {
                this.toasty.success('Updated successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        } else {
          this.myTopicService
            .create(
              Object.assign(res, { myCategoryId: this.selectedCategory._id, mySubjectId: this.selectedSubject._id })
            )
            .then(resp => {
              if (resp.data) {
                this.myTopics.push(Object.assign(resp.data));
                this.toasty.success('Created successfully!');
              }
            })
            .catch(err => {
              this.toasty.error(
                err.data && err.data.data && err.data.data.message
                  ? err.data.data.message
                  : 'Something went wrong, please try again!'
              );
            });
        }
      },
      () => {}
    );
  }
}
