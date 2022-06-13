import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TutorService } from '../../services/tutor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeoService, LanguageService, WebinarService, AuthService } from '../../../shared/services';
import { TutorGradeComponent } from '../grades/grade.component';
import * as _ from 'lodash';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { IUser } from '../../../user/interface';
import { IWebinar } from '../../../webinar/interface';
declare var $: any;
import { IStatsReview } from '../../../reviews/interface';
import { FavoriteService } from '../../../shared/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './profile.html'
})
export class TutorProfileComponent implements OnInit, AfterViewInit {
  public tutor: IUser = {};
  public languages: any;
  public languageNames: any = [];
  public objectLanguage: any = {};
  public gradeNames: any = [];
  public webinars: IWebinar[] = [];
  public currentPage: Number = 1;
  public pageSize: Number = 5;
  public searchFields: any = {};
  public isLoggedin: Boolean = false;
  public webUrl: string;
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public count: Number = 0;
  public showChar: number = 500;
  public showMore: boolean = false;
  public slideConfig = {
    centerMode: false,
    centerPadding: '60px',
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: false,
          dots: false,
          centerPadding: '40px',
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false,
          centerMode: false,
          dots: false,
          centerPadding: '40px',
          slidesToShow: 1,
          vertical: false,
          slidesToScroll: 1
        }
      }
    ]
  };

  public config: any;

  public statsReview: IStatsReview = {
    ratingAvg: 0,
    ratingScore: 0,
    totalRating: 0
  };

  public optionsReview: any = {
    rateTo: ''
  };
  public type: any;

  public urlYoutube: any;
  // tslint:disable-next-line:max-line-length
  public moreTag = '';
  constructor(
    private route: ActivatedRoute,
    private tutorService: TutorService,
    private toasty: ToastrService,
    private grades: TutorGradeComponent,
    private seoService: SeoService,
    private authService: AuthService,
    private languageService: LanguageService,
    private webinarService: WebinarService,
    public ngxSmartModalService: NgxSmartModalService,
    private sanitizer: DomSanitizer,
    private tutorFavoriteService: FavoriteService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.tutor = this.route.snapshot.data.tutor;
    seoService.update(this.tutor.name);
    this.config = this.route.snapshot.data['appConfig'];
    this.webUrl = window.appConfig.url;
  }

  ngOnInit() {
    this.languages = this.languageService.getLang();
    this.objectLanguage = this.languageService.languages;
    this.isLoggedin = this.authService.isLoggedin();
    this.optionsReview.rateTo = this.tutor._id;
    this.statsReview = {
      ...this.statsReview,
      ...{
        ratingAvg: this.tutor.ratingAvg,
        totalRating: this.tutor.totalRating,
        ratingScore: this.tutor.ratingScore
      }
    };
    if (this.tutor.languages) {
      this.mapLanguageName(this.tutor.languages);
    }
    if (this.tutor.gradeItems && this.tutor.gradeItems.length > 0) {
      this.mapGradeName(this.tutor.gradeItems);
    }
    this.queryWebinar();
    if (this.tutor && this.tutor.bio && this.tutor.bio.length > this.showChar) {
      this.showMore = true;
    }

    this.urlYoutube = this.setUrl(this.tutor.idYoutube);
  }

  queryWebinar() {
    let params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`,
        isOpen: true,
        tutorId: this.tutor._id || ''
      },
      this.searchFields
    );
    this.webinarService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.webinars = resp.data.items;
        this.webinars.map(webinar => {
          this.webinarService
            .getLatest(webinar._id)
            .then(res => (webinar.latestSlot = res.data.latest ? res.data.latest : null))
            .catch(e => alert(this.translate.instant('Something went wrong!')));
        });
      })
      .catch(() => alert(this.translate.instant('Something went wrong, please try again!')));
  }

  mapGradeName(gradeItems: any) {
    gradeItems.forEach(key => {
      this.gradeNames.push(key.name);
    });
  }

  mapLanguageName(languageKeys: any) {
    languageKeys.forEach(key => {
      this.languageNames.push(this.objectLanguage[key]);
    });
  }

  setUrl(idYoutube) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${idYoutube}`);
  }

  favorite() {
    if (!this.isLoggedin) this.toasty.error(this.translate.instant('Please loggin to use this feature!'));
    else {
      let params = Object.assign(
        {
          tutorId: this.tutor._id,
          type: 'tutor'
        },
        {}
      );
      this.tutorFavoriteService
        .favorite(params, 'tutor')
        .then(res => {
          this.tutor.isFavorite = true;
          this.toasty.success(this.translate.instant('Added to your favorite tutor list successfully!'));
        })
        .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }

  unFavorite() {
    if (!this.isLoggedin) this.toasty.error(this.translate.instant('Please loggin to use this feature!'));
    else {
      this.tutorFavoriteService
        .unFavorite(this.tutor._id, 'tutor')
        .then(res => {
          this.tutor.isFavorite = false;
          this.toasty.success(this.translate.instant('Deleted from your favorite tutor list successfully!'));
        })
        .catch(() => this.toasty.error(this.translate.instant('Something went wrong, please try again!')));
    }
  }

  clickCategory(catId: any) {
    let categoryIds = [];
    categoryIds.push(catId);
    this.searchFields.categoryIds = categoryIds.join(',');
    this.router.navigate(['/categories'], {
      queryParams: { categoryIds: this.searchFields.categoryIds }
    });
  }

  ngAfterViewInit() {
    $('#btn-view-webinars').click(function () {
      $('html, body').animate(
        {
          scrollTop: $('#view-webinars').offset().top
        },
        800
      );
    });
  }
}
