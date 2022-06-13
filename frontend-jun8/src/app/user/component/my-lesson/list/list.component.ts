import { Component, OnInit } from '@angular/core';
import { AuthService, AppointmentService, SeoService } from '../../../../shared/services';
import { IMylesson, IUser } from '../../../interface';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from '../../../../transactions/services/transaction.service';
import { ITransaction } from '../../../../transactions/interface';
import { ModalAppointment } from '../../modal-appointment/modal-appointment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IWebinar } from '../../../../webinar/interface';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  selector: 'app-list-lesson',
  templateUrl: './list.html'
})
export class ListLessonComponent implements OnInit {
  public currentUser: IUser;
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public total: Number = 2;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public appointments: IMylesson[] = [];
  public count: Number = 0;
  public loading: boolean = false;
  public config: any;
  public timeout: any;
  public joining: boolean = false;
  public tab: string = 'subject';
  public filterTransactionOptions: any = {
    currentPage: 1,
    pageSize: 10,
    sortOption: {
      sortBy: 'createdAt',
      sortType: 'desc'
    },
    total: 0,
    loading: false,
    searchFields: {}
  };
  public transactions: ITransaction[] = [];

  constructor(
    private auth: AuthService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private toasty: ToastrService,
    private transactionService: TransactionService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {
    seoService.update('My Lessons');
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    if (this.auth.isLoggedin()) {
      this.auth.getCurrentUser().then(resp => {
        this.currentUser = resp;
        this.query();
      });
    }
  }

  async query() {
    this.loading = true;
    let params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`,
        userId: this.currentUser._id,
        targetType: this.tab,
        paid: true
      },
      this.searchFields
    );
    await this.appointmentService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.appointments = resp.data.items;
        this.total = resp.data.count;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        alert(this.translate.instant('Something went wrong, please try again!'));
      });
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

  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    if (this.tab === 'subject') {
      this.query();
    } else {
      this.queryTransactionWebinar();
    }
  }

  doSearch(evt) {
    const searchText = evt.target.value; // this is the search text
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
    this.timeout = window.setTimeout(() => {
      this.searchFields.description = searchText;
      this.query();
    }, 400);
  }

  joinMeeting(appointmentId: string) {
    if (!this.joining) {
      this.joining = true;
      this.appointmentService
        .joinMeeting(appointmentId)
        .then(resp => {
          this.joining = false;
          if (resp.data && resp.data.zoomUrl) {
            window.open(resp.data.zoomUrl, '_blank').focus();
          }
        })
        .catch(err => {
          this.joining = false;
          return this.toasty.error(
            this.translate.instant(
              (err.data && err.data.data && err.data.data.message) ||
                err.data.message ||
                'Something went wrong, please try again!'
            )
          );
        });
    } else {
      this.toasty.success(this.translate.instant('Connecting...'));
    }
  }

  onTabSelect(tab: string) {
    this.tab = tab;
    if (this.tab === 'subject') {
      this.query();
    } else this.queryTransactionWebinar();
  }

  queryTransactionWebinar() {
    if (this.auth.isLoggedin()) {
      this.auth.getCurrentUser().then(resp => {
        this.currentUser = resp;
        const params = Object.assign({
          page: this.filterTransactionOptions.currentPage,
          take: this.filterTransactionOptions.pageSize,
          sort: `${this.filterTransactionOptions.sortOption.sortBy}`,
          sortType: `${this.filterTransactionOptions.sortOption.sortType}`,
          userId: this.currentUser._id,
          targetType: 'webinar',
          status: 'completed'
        });
        this.loading = true;
        this.transactionService
          .search(params)
          .then(resp => {
            this.transactions = resp.data.items;
            this.filterTransactionOptions.total = resp.data.count;
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            return this.toasty.error(this.translate.instant('Something went wrong, please try again'));
          });
      });
    }
  }

  openModalAppointment(webinar: IWebinar) {
    if (webinar) {
      const modalRef = this.modalService.open(ModalAppointment, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });
      modalRef.componentInstance.currentUser = this.currentUser;
      modalRef.componentInstance.webinar = webinar;
      modalRef.componentInstance.type = 'student';
      modalRef.result.then(
        res => {},
        () => {}
      );
    }
  }
}
