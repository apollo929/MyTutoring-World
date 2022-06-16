import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, SystemService } from '../../shared/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'forgot.html'
})
export class ForgotComponent {
  public email: String = '';
  public submitted: Boolean = false;
  private Auth: AuthService;
  public appConfig: any;

  constructor(
    auth: AuthService,
    private systemService: SystemService,
    public router: Router,
    private route: ActivatedRoute,
    private toasty: ToastrService
  ) {
    this.Auth = auth;
    systemService.configs().then(resp => (this.appConfig = resp));
  }

  forgot(frm: any) {
    this.submitted = true;
    this.Auth.forgot(this.email)
      .then(resp => {
        this.toasty.success('New password has been sent, please check your email inbox.');
        this.email = '';
      })
      .catch(err => this.toasty.error(err.data.data.message));
  }
}
