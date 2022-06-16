import { DocumentModalComponent } from './../view-document-modal/view-document.componet';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TutorService } from '../tutor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../../subject/subject.service';
import { LanguageService, CountryService } from '../../shared/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { AddCetificationComponent } from '../add-certification/add.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MyCategoryService } from '../../shared/services/my-category.service';
import { MyTopicService } from '../../shared/services/my-topic.service';
import { MySubjectService } from '../../shared/services/my-subject.service';
import { MyCategoryFormComponent } from '../modal-create-category/modal';
import { CategoryService } from '../../category/category.service';
import { MyTopicFormComponent } from '../modal-create-topic/modal';
import { MySubjectFormComponent } from '../modal-mysubject/my-subject';

@Component({
  selector: 'app-tutor-update',
  templateUrl: '../form.html'
})
export class TutorUpdateComponent implements OnInit {
  public info: any = {};
  public avatarUrl = '';
  public isSubmitted = false;
  public tutorId: String;
  public subjects: any;
  public languages: any[];
  public countries: any[];
  public config: any;
  public urlYoutube: any;
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
  @Output() afterReject = new EventEmitter();
  public loading: boolean = false;
  public tutorSubjects: any[] = [];
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
  public categories: any[] = [];
  public selectedCategory: any;
  public selectedSubject: any;
  public myCategories: any[] = [];
  public mySubjects: any[] = [];
  public myTopics: any[] = [];

  // tslint:disable-next-line:max-line-length
  constructor(
    private router: Router,
    private subjectService: SubjectService,
    private tutorService: TutorService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private modalService: NgbModal,
    public countryService: CountryService,
    private sanitizer: DomSanitizer,
    private myCategoryService: MyCategoryService,
    private myTopicService: MyTopicService,
    private mySubjectService: MySubjectService,
    private categoryService: CategoryService
  ) {
    this.config = this.route.snapshot.data['appConfig'];
    this.queryCategories();
  }

  ngOnInit() {
    this.languages = this.languageService.getLang();
    this.countries = this.countryService.getCountry();
    this.tutorId = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.tutorService
      .findOne(this.tutorId)
      .then(resp => {
        this.info = _.pick(resp.data, [
          'name',
          'username',
          'avatarUrl',
          'subjectIds',
          'bio',
          'createdAt',
          'email',
          'isActive',
          'emailVerified',
          'address',
          'role',
          'emailNotification',
          'type',
          'phoneNumber',
          'phoneVerified',
          'rejected',
          '_id',
          'grades',
          'languages',
          // 'issueDocument',
          'isHomePage',
          'zipCode',
          'idYoutube',
          'country',
          'featured',
          'education',
          'experience',
          'certification',
          'price1On1Class',
          // 'resumeDocument',
          // 'certificationDocument',
          'commissionRate',
          'state',
          'city',
          'introVideoId',
          'introYoutubeId',
          'timezone',
          'introVideo',
          'isZoomAccount',
          'pendingApprove'
        ]);
        this.loading = false;
        if (this.info.introYoutubeId) this.urlYoutube = this.setUrl(this.info.introYoutubeId);
        this.queryMyCategories();
      })
      .catch(e => {
        this.loading = false;
        return this.toasty.error('Something went wrong, please try again');
      });
  }
  queryCategories() {
    this.categoryService.search({ take: 100, isActive: true }).then(
      resp => {
        this.categories = resp.data.items;
      },
      err => this.toasty.error('Something went wrong, please try again!')
    );
  }

  getTutorSubjects(tutorId) {
    this.tutorService.getTutorSubjects({ tutorId }).then(resp => {
      this.tutorSubjects = resp.data.items;
    });
  }

  querySubjects() {
    this.subjectService.search({ take: 100 }).then(resp => {
      this.subjects = resp.data.items;
    });
  }
  isImage(document: any) {
    return document.mimeType.includes('image');
  }

  isDoc(document: any) {
    return (
      document.mimeType === 'application/msword' ||
      document.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      document.mimeType === 'application/pdf'
    );
  }
  showDocument(document) {
    const modalRef = this.modalService.open(DocumentModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.componentInstance.fileUrl = document.fileUrl;
  }
  submit(frm: any) {
    this.isSubmitted = true;

    if (!frm.valid || !this.info.timezone) {
      return this.toasty.error('Please complete the required fields!');
    }

    const data = _.pick(this.info, [
      'name',
      'username',
      'subjectIds',
      'bio',
      'email',
      'isActive',
      'emailVerified',
      'address',
      'emailNotification',
      'phoneNumber',
      'phoneVerified',
      'grades',
      'languages',
      'password',
      'isHomePage',
      'zipCode',
      'idYoutube',
      'country',
      'featured',
      'price1On1Class',
      'commissionRate',
      'state',
      'city',
      'timezone'
    ]);

    this.tutorService
      .update(this.tutorId, data)
      .then(resp => {
        this.toasty.success('Updated successfuly!');
        this.router.navigate(['/tutor/list']);
      })
      .catch(err => this.toasty.error('Something went wrong, please check and try again!'));
  }

  afterUpload(evt) {
    if (!this.info._id) {
      this.info.avatar = evt;
    }
  }

  approve() {
    if (window.confirm('Are you sure want to approve this tutor?')) {
      this.tutorService
        .approve(this.tutorId)
        .then(resp => {
          this.info.rejected = false;
          this.info.pendingApprove = false;
          this.toasty.success('Approve successfully');
        })
        .catch(err => this.toasty.error('Something went wrong, please check and try again!'));
    }
  }

  reject() {
    const modalRef = this.modalService.open(RejectComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.tutorId = this.tutorId;
    modalRef.result.then(
      res => {
        if (res.success) {
          this.info.rejected = true;
          this.info.pendingApprove = false;
        }
        this.afterReject.emit(res);
      },
      () => {}
    );
  }
  open(type: string, index = 0, certificate = null) {
    const modalRef = this.modalService.open(AddCetificationComponent, { centered: true, backdrop: 'static' });
    modalRef.componentInstance.tutorId = this.tutorId;
    modalRef.componentInstance.certificate = certificate;
    modalRef.componentInstance.type = type || 'education';
    modalRef.result.then(
      res => {
        if (certificate) {
          this.info[type][index] = res;
        } else {
          this.info[type].push(res);
        }
      },
      () => {}
    );
  }

  deleteCer(type: string, index: number, certificate = null) {
    if (window.confirm('Are you sure want to delete this certificate?')) {
      this.tutorService
        .deleteCertificate(certificate._id)
        .then(resp => {
          this.info[type].splice(index, 1);
          this.toasty.success('Deleted certificate successfully');
        })
        .catch(e => {
          this.toasty.error('Something went wrong, please try again!');
        });
    }
  }

  setUrl(idYoutube) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${idYoutube}`);
  }
  changeTimezone(event) {
    if (event === 'Asia/Saigon') {
      this.info.timezone = 'Asia/Ho_Chi_Minh';
    } else {
      this.info.timezone = event;
    }
  }

  queryMyCategories() {
    this.filterMyCategory.loading = true;
    const params = Object.assign({
      page: this.filterMyCategory.currentPage,
      take: this.filterMyCategory.pageSize,
      sort: `${this.filterMyCategory.sortOption.sortBy}`,
      sortType: `${this.filterMyCategory.sortOption.sortType}`,
      tutorId: this.tutorId
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

  queryMySubjects() {
    this.filterMySubject.loading = true;
    const params = Object.assign({
      page: this.filterMySubject.currentPage,
      take: this.filterMySubject.pageSize,
      sort: `${this.filterMySubject.sortOption.sortBy}`,
      sortType: `${this.filterMySubject.sortOption.sortType}`,
      myCategoryId: this.filterMySubject.myCategoryId,
      tutorId: this.tutorId
    });
    this.mySubjectService
      .search(params)
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
      myCategoryId: this.selectedCategory._id,
      tutorId: this.tutorId
    });
    this.myTopicService
      .search(params)
      .then(resp => {
        this.filterMyTopic.loading = false;
        if (resp.data && resp.data.items) {
          this.filterMyTopic.total = resp.data.count;
          this.myTopics = resp.data.items;
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
  submitCategory(myCategory = { isActive: true } as any) {
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
            .update(myCategory._id, Object.assign(res, { tutorId: this.tutorId }))
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
            .create(Object.assign(res, { tutorId: this.tutorId }))
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

  selectMyCategory(category: any) {
    this.selectedCategory = category;
    this.selectedSubject = null;
    this.filterMySubject.myCategoryId = category._id;
    this.mySubjects = [];
    this.myTopics = [];
    this.queryMySubjects();
  }

  submitSubject(mySubject = { isActive: true } as any) {
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
            .update(
              mySubject._id,
              Object.assign(res, { myCategoryId: this.selectedCategory._id, tutorId: this.tutorId })
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
          this.mySubjectService
            .create(Object.assign(res, { myCategoryId: this.selectedCategory._id, tutorId: this.tutorId }))
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

  selectMySubject(subject: any) {
    this.selectedSubject = subject;
    this.filterMyTopic.mySubjectId = subject._id;
    this.myTopics = [];
    this.queryMyTopics();
  }

  submitTopic(myTopic = { isActive: true } as any) {
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
              Object.assign(res, {
                myCategoryId: this.selectedCategory._id,
                mySubjectId: this.selectedSubject._id,
                tutorId: this.tutorId
              })
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
              Object.assign(res, {
                myCategoryId: this.selectedCategory._id,
                mySubjectId: this.selectedSubject._id,
                tutorId: this.tutorId
              })
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

  inviteTutorJoinZoom() {
    this.tutorService
      .inviteZoom(this.info.email)
      .then(resp => {
        console.log(resp);
      })
      .catch(e => {
        console.log(e);
      });
  }
}
@Component({
  selector: 'app-reject-modal',
  template: `
    <div class="modal-header">
      <h2 class="modal-title">Reason</h2>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <h4>Why you want to reject this tutor ?</h4>
      <input
        type="text"
        class="form-control"
        placeholder="Write the reason"
        required
        name="name"
        [(ngModel)]="reason"
      />
    </div>
    <div class="modal-footer">
      <button type="submit" class="btn btn-outline-dark" (click)="submit()">Submit</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.dismiss('Cross click')">Close</button>
    </div>
  `
})
export class RejectComponent {
  @Input() tutorId: any;
  public reason: String = '';

  constructor(private toasty: ToastrService, public activeModal: NgbActiveModal, private tutorService: TutorService) {}

  submit() {
    if (!this.reason) {
      return this.toasty.error('Please enter reason.');
    }
    this.tutorService
      .reject(this.tutorId, { reason: this.reason })
      .then(resp => {
        this.activeModal.close(resp.data);
        this.toasty.success('Reject successfully!');
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }
}
