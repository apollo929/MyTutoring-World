import { Component } from '@angular/core';
import { EarningStatsService } from '../../services/earning-stats.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-earning-detail',
  templateUrl: './detail.html'
})
export class DetailEarningComponent {
  public item: any = {};
  public config: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private earningStatsService: EarningStatsService,
    private toasty: ToastrService
  ) {
    const id = this.route.snapshot.params.tutorId;
    this.earningStatsService.findOne(id).then(res => {
      this.item = res.data;
    });
    this.config = this.route.snapshot.data['appConfig'];
  }
}
