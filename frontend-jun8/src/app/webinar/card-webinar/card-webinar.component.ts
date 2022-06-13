import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { IWebinar } from '../interface';
import { ActivatedRoute } from '@angular/router';
import { WebinarService } from '../webinar.service';
declare var jQuery: any;
@Component({
  selector: 'app-card-webinar',
  templateUrl: './card-webinar.html'
})
export class CardWebinarComponent implements OnInit, AfterViewInit {
  @Input() webinar: IWebinar;
  public description: string;
  @Input() config: any;
  public latestSlot: any;
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toasty: ToastrService,
    private webinarService: WebinarService
  ) {
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.webinarService
      .getLatest(this.webinar._id)
      .then(res => {
        if (res.data && res.data.latest) this.latestSlot = res.data.latest;
      })
      .catch(e => {
        this.toasty.error(this.translate.instant('something went wrong!'));
      });
  }

  ngAfterViewInit() {}
}
