import { SeoService } from './../../shared/services/seo.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  private Auth: AuthService;
  public credentials = {
    email: '',
    password: '',
    rememberMe: false
  };
  public submitted: boolean = false;
  public appConfig: any;
  public returnUrl: string;

  constructor(
    auth: AuthService,
    public router: Router,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private translate: TranslateService
  ) {
    this.appConfig = this.route.snapshot.data.appConfig;
    if (this.appConfig) {
      let title = this.appConfig.siteName + ' - Login';
      seoService.update(title);
    }
    this.Auth = auth;
    let currentUrl = localStorage.getItem('currentUrl');
    if (currentUrl && currentUrl === '/auth/sign-up') currentUrl = '/home';
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || currentUrl || '/users/dashboard';
    if (auth.getAccessToken()) {
      this.router.navigate(['/']);
    }
  }

  login(frm: any) {
    this.submitted = true;
    if (frm.invalid) {
      return;
    }
    this.credentials.email = this.credentials.email.toLowerCase().replace(/\s+/g, '');
    this.Auth.login(this.credentials)
      .then(resp => {
        this.router.navigateByUrl(this.returnUrl, {
          state: {
            current: resp
          }
        });
      })
      .catch(err => {
        if (err) {
          return this.toasty.error(
            this.translate.instant((err.data && err.data.data && err.data.data.message) || err.data.message)
          );
        }
        this.toasty.error(this.translate.instant('Something went wrong, please try again.'));
      });
  }
}
