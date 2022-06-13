import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { IUser } from '../../../user/interface';
@Component({
  templateUrl: './success.html'
})
export class SuccessComponent implements OnInit {
  public tutor: IUser;
  public second: any;
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.tutor = this.route.snapshot.data.tutor;
    this.second = 5;
    const i = window.setInterval(() => {
      if (this.second > 0) {
        this.second = this.second - 1;
      } else {
        window.clearInterval(i);
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}
