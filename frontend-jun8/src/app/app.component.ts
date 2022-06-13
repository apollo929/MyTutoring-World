import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, SeoService, SystemService } from './shared/services';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart, NavigationCancel } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'app';
  public config: any;

  private seoChangedSubscription: Subscription;
  constructor(
    private router: Router,
    private authService: AuthService,
    private seoService: SeoService,
    private translate: TranslateService,
    private systemService: SystemService,
    private route: ActivatedRoute
  ) {
    this.seoChangedSubscription = seoService.seoChanged$.subscribe(data => {
      if (!data) {
        return;
      }
      if (data.title) {
        document.title = data.title;
      }
      if (data.meta) {
        $('meta[name="description"]').attr('content', data.meta.description);
        $('meta[name="keywords"]').attr('content', data.meta.keywords);
        $('meta[property="og:description"]').attr('content', data.meta.description);
      } else {
        this.config = this.route.snapshot.data.appConfig;
        if (this.config) {
          this.seoService.update(this.config.siteName, this.config.homeSEO);
        }
      }
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (!this.authService.isLoggedin()) {
          if (event.url !== '/auth/login') {
            localStorage.setItem('currentUrl', event.url);
          }
        }
      }
      if (event instanceof NavigationEnd) {
        if (this.router.url.indexOf('#webinar') === -1 && this.router.url.indexOf('#review') === -1) {
          $('html, body').animate({ scrollTop: 0 });
        } else {
          $('html, body').animate(
            {
              scrollTop:
                this.router.url.indexOf('#webinar') > -1 ? $('#webinar').offset().top : $('#review').offset().top
            },
            1000
          );
        }
        if (!this.authService.isLoggedin()) {
          if (event.url !== '/auth/login') {
            localStorage.setItem('currentUrl', this.router.url);
          }
        }
      }
    });
    const defaultLang = 'en';
    // https://github.com/ngx-translate/core
    translate.setDefaultLang(defaultLang);
    systemService.configs().then(resp => {
      translate.setDefaultLang(resp.i18n.defaultLanguage);
      translate.use(resp.userLang);

      //change favicon
      $('#favicon').attr('href', resp.siteFavicon);
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedin()) {
      this.authService.getCurrentUser();
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.seoChangedSubscription.unsubscribe();
  }
}
