import { ParticipantFormComponent } from '../modal-participants/participants-form';
import { SeoService } from '../../../../shared/services/seo.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services';
import { CourseService } from 'app/shared/services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { ICourse } from '../../../../course/interface';
import { IUser } from '../../../interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'course-listing',
  templateUrl: './list.html'
})
export class CourseListingComponent implements OnInit {
  public total: number = 0;
  public items: ICourse[];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public currentUser: IUser;
  public fromItem: number = 0;
  public toItem: number = 0;
  public timeout: any;
  public config: any;
  public updating: boolean = false;
  constructor(
    private router: Router,
    private courseService: CourseService,
    private toasty: ToastrService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
    seoService.update('My Group Classes');
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.auth.getCurrentUser().then(resp => {
      this.currentUser = resp;
      if (this.currentUser._id) {
        this.query();
      }
    });
  }

  query() {
    let params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`,
        tutorId: this.currentUser._id
      },
      this.searchFields
    );
    this.courseService
      .search(params)
      .then(resp => {
        this.total = resp.data.count;
        this.items = resp.data.items;
        if (this.currentPage === 1) {
          this.fromItem = this.currentPage;
          this.toItem = this.items.length;
        } else if (this.currentPage > 1) {
          this.fromItem =
            this.currentPage * this.pageSize > this.total
              ? (this.currentPage - 1) * this.pageSize
              : this.currentPage * this.pageSize;
          this.toItem = this.fromItem + this.items.length;
        }
      })
      .catch(() => alert('Something went wrong, please try again!'));
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

  showChange(evt) {
    this.pageSize = evt.target.value;
    this.query();
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  onSort(evt) {
    this.sortOption = evt;
    this.query();
  }

  remove(item: any, index: number) {
    if (window.confirm(this.translate.instant('Are you sure want to delete this course?'))) {
      this.courseService
        .delete(item._id)
        .then(() => {
          this.toasty.success(this.translate.instant(this.translate.instant('Course has been deleted!')));
          this.items.splice(index, 1);
        })
        .catch(e => this.toasty.error(this.translate.instant(e.data.data.message)));
    }
  }
  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    this.query();
  }

  showParticipants(course: any) {
    const modalRef = this.modalService.open(ParticipantFormComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    modalRef.componentInstance.courseId = course._id;
  }

  changeStatus(course) {
    if (!this.updating) {
      this.updating = true;
      this.courseService
        .changeStatus(course._id)
        .then(resp => {
          course['disabled'] = !course.disabled;
          const message = course.disabled ? 'Disabled' : 'Enabled';
          this.toasty.success(this.translate.instant(this.translate.instant(message)));
          this.updating = false;
        })
        .catch(err => {
          this.updating = false;
          return this.toasty.error(this.translate.instant('Something went wrong, please check and try again!'));
        });
    }
  }
}
