import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TransactionService } from '../../services/transaction.service';
import { AppointmentService } from '../../../appointment/services/appointment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-enroll-detail',
  templateUrl: './detail.html'
})
export class TransactionDetailComponent implements OnInit {
  public transaction: any = {};
  public tId: any;
  public config: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private transactionService: TransactionService,
    private location: Location
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.tId = this.route.snapshot.paramMap.get('id');
    this.transactionService.findOne(this.tId).then(resp => {
      if (!resp.data) {
        return (this.transaction = null);
      }
      this.transaction = resp.data;
    });
  }
}
