import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UtilService, SystemService } from '../../../shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  public appConfig: any;
  public currentUser: any;
  public isHome: Boolean = false;
  public isOpenedMenu = false;
  public userLang: any;
  public languages: any = [];
  public flag: any = `/assets/images/flags/en.svg`;
  public isLoaded: any = false;

  private userLoadedSubscription: Subscription;
  private observableSubscription: Subscription;
  constructor(
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private systemService: SystemService,
    private translate: TranslateService
  ) {
    this.userLoadedSubscription = authService.userLoaded$.subscribe(data => (this.currentUser = data));
    this.observableSubscription = this.utilService.eventChanged$.subscribe(data => {
      if (data.name === 'profileUpdate') {
        this.currentUser = data.value;
      }
    });
    $(window).scroll(function () {
      const scroll = $(window).scrollTop();
      if (scroll >= 50) {
        $('.header').addClass('scroll');
      } else {
        $('.header').removeClass('scroll');
      }
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedin()) {
      this.authService.getCurrentUser().then(resp => (this.currentUser = resp));
    }
    this.appConfig = this.route.snapshot.data.appConfig;
    this.isHome = this.router.url === '/';
    this.systemService.configs().then(resp => {
      this.isLoaded = true;
      this.languages = resp.i18n.languages;
      this.userLang = resp.userLang;
      this.languages.map(item => {
        if (item.key === this.userLang) this.flag = item.flag;
      });

      this.appConfig = resp;
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.userLoadedSubscription.unsubscribe();
    this.observableSubscription.unsubscribe();
  }

  logout() {
    this.authService.removeToken();
    // this.router.navigate(['/auth/login']);
    window.location.href = '/';
  }

  changeLang(lang: any) {
    this.flag = lang.flag;

    this.userLang = lang.key;
    this.systemService.setUserLang(this.userLang);
    this.translate.use(this.userLang);
  }

  login() {
    if (localStorage.getItem('currentUrl')) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: localStorage.getItem('currentUrl') } });
      localStorage.removeItem('currentUrl');
    } else this.router.navigate(['/auth/login']);
  }
}
