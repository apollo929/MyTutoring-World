import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SystemService } from '../../shared/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  Auth: AuthService;
  credentials = {
    email: '',
    password: ''
  };
  public appConfig: any;
  public submitted: Boolean = false;

  constructor(
    auth: AuthService,
    public router: Router,
    private systemService: SystemService,
    private toasty: ToastrService
  ) {
    this.Auth = auth;
    if (auth.getAccessToken()) {
      this.router.navigate(['/starter']);
    }
    systemService.configs().then(resp => (this.appConfig = resp));
  }

  login(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error('Something went wrong, please check and try again!');
    }
    this.Auth.login(this.credentials)
      .then(() => this.router.navigate(['/starter']))
      .catch(() => this.toasty.error('Email or password went wrong, please try again'));
  }
}
