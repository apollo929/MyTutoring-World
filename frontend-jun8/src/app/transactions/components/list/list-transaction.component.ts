import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TransactionService } from '../../services/transaction.service';
import { AuthService, SeoService } from '../../../shared/services';
import { ITransaction } from '../../interface';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;
@Component({
  selector: 'list-appointment',
  templateUrl: './list.html'
})
export class ListTransactionComponent implements OnInit {
  public userId: any;
  public status: any;
  public page = 1;
  public pageSize: Number = 10;
  public total: any = 8;
  public searchFields: any = {
    targetType: '',
    status: ''
  };
  public transaction: ITransaction[] = [];
  public loading: boolean = false;
  public type: any;
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public columns = [
    {
      title: 'Tutor name',
      dataIndex: 'tutor',
      sorter: true,
      sortBy: 'tutorId'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: true,
      sortBy: 'type'
    },
    {
      title: 'Code',
      dataIndex: 'code',
      sorter: true,
      sortBy: 'code'
    }
  ];
  public config: any;
  constructor(
    private toasty: ToastrService,
    private authService: AuthService,
    private seoService: SeoService,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    seoService.update('My Transactions');
    this.loading = true;
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.authService.getCurrentUser().then(resp => {
      this.userId = resp.id;
      this.type = resp.type;
      this.query(this.type);
    });
  }

  query(type: any) {
    this.loading = true;
    this.transactionService
      .search(
        Object.assign(
          {
            userId: this.userId,
            page: this.page,
            take: this.pageSize,
            sort: `${this.sortOption.sortBy}`,
            sortType: `${this.sortOption.sortType}`
          },
          this.searchFields
        )
      )
      .then(resp => {
        this.transaction = resp.data.items;
        this.total = resp.data.count;
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        return this.toasty.error(this.translate.instant('Something went wrong, please try again'));
      });
  }

  pageChange(type: string) {
    $('html, body').animate({ scrollTop: 0 });
    this.query(type);
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;

    this.query(this.type);
  }

  onSort(evt) {
    this.sortOption = evt;
    this.query('');
  }
}
