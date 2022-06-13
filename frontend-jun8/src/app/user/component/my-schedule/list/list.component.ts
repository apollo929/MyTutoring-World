import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AuthService, AppointmentService, SeoService } from '../../../../shared/services';
import { IUser, IMylesson } from '../../../interface';
import { ToastrService } from 'ngx-toastr';
import { ITransaction } from '../../../../transactions/interface';
import { TransactionService } from '../../../../transactions/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IWebinar } from '../../../../webinar/interface';
import { ModalAppointment } from '../../modal-appointment/modal-appointment.component';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-list-schedule',
  templateUrl: './list.html'
})
export class ListScheduleComponent implements OnInit {
  public currentUser: IUser;
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public appointments: IMylesson[] = [];
  public count: Number = 0;
  public loading: boolean = false;
  public timeout: any;
  public starting: boolean = false;
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
    private seoService: SeoService,
    private toasty: ToastrService,
    private transactionService: TransactionService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) {
    seoService.update('My Appointments');
  }
  ngOnInit() {
    if (this.auth.isLoggedin()) {
      this.auth.getCurrentUser().then(resp => {
        this.currentUser = resp;
        this.query();
      });
    }
  }

  query() {
    this.loading = true;
    let params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`,
        tutorId: this.currentUser._id,
        targetType: this.tab,
        paid: true
      },
      this.searchFields
    );
    this.appointmentService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.appointments = resp.data.items;
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
    this.query();
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

  startMeeting(appointmentId: string) {
    if (!this.starting) {
      this.starting = true;
      this.appointmentService
        .startMeeting(appointmentId)
        .then(resp => {
          this.starting = false;
          if (resp.data && resp.data.zoomUrl) {
            window.open(resp.data.zoomUrl, '_blank').focus();
          }
        })
        .catch(err => {
          this.starting = false;
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

  queryTransactionWebinar() {
    if (this.auth.isLoggedin()) {
      this.auth.getCurrentUser().then(resp => {
        this.currentUser = resp;
        const params = Object.assign({
          page: this.filterTransactionOptions.currentPage,
          take: this.filterTransactionOptions.pageSize,
          sort: `${this.filterTransactionOptions.sortOption.sortBy}`,
          sortType: `${this.filterTransactionOptions.sortOption.sortType}`,
          tutorId: this.currentUser._id,
          targetType: 'webinar',
          status: 'completed'
        });
        this.loading = true;
        this.transactionService
          .getTransactionsOfTutor(params)
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

  onTabSelect(tab: string) {
    this.tab = tab;
    if (this.tab === 'subject') {
      this.query();
    } else this.queryTransactionWebinar();
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
      modalRef.componentInstance.type = 'tutor';
      modalRef.result.then(
        res => {},
        () => {}
      );
    }
  }
}
