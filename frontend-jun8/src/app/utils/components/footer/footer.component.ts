import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html'
})
export class FooterComponent implements OnInit {
  public appConfig: any;
  public subjects: any = [];
  public posts: any = [];
  public config: any = {};
  public textButton = 'Register';
  public isLoggedin: boolean = false;
  constructor(
    public router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.appConfig = window.appConfig;
    const subjects = this.route.snapshot.data['subjects'];
    this.subjects = subjects;
    const posts = this.route.snapshot.data['posts'];
    this.posts = posts;
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    this.isLoggedin = this.authService.isLoggedin();
  }

  register() {
    if (!this.isLoggedin) {
      this.router.navigate(['/auth/sign-up']);
    } else {
      if (window.confirm(this.translate.instant('Do you want to log out?'))) {
        this.authService.removeToken();
        this.router.navigate(['/auth/sign-up']);
      }
    }
  }
}
