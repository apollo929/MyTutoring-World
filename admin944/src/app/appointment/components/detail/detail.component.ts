import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { AppointmentService } from '../../services/appointment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-appointment',
  templateUrl: './detail.html'
})
export class AppointmentDetailComponent implements OnInit {
  public appointment: any = {};
  private aId: any;
  public config: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService,
    private appointmentService: AppointmentService,
    private location: Location
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.aId = this.route.snapshot.paramMap.get('id');
    this.appointmentService.findOne(this.aId).then(resp => {
      this.appointment = _.pick(resp.data, [
        'status',
        'tutor',
        'user',
        'startTime',
        'toTime',
        '_id',
        'subject',
        'recordings',
        'transaction',
        'paid',
        'subject',
        'webinar',
        'targetType',
        'webinar'
      ]);
    });
  }

  cancelEvent(info: any) {
    if (!info && info.status !== 'canceled') {
      return this.toasty.error('Something went wrong, please try again.');
    }
    this.appointment.status = 'canceled';
  }
}
