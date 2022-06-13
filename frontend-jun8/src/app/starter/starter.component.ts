import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SeoService } from '../shared/services';
import { CategoryService, TestimonialService } from '../shared/services';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
declare var jQuery: any;
import { TutorService } from '../tutor/services/tutor.service';
import { DomSanitizer } from '@angular/platform-browser';
import { WebinarService } from '../webinar/webinar.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  templateUrl: './starter.component.html'
})
export class StarterComponent implements OnInit, AfterViewInit {
  public currentUser: any;
  public categories: any;
  public count: Number = 0;
  public webinars = [];
  public currentPage: Number = 1;
  public pageSize: Number = 3;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };
  public queryParams: any;
  public categoryName: String;
  public config: any;
  public listCategories: any[];
  public tutors: any[];
  public slides = [
    { img: 'assets/images/profile/profile-01.png' },
    { img: 'assets/images/profile/profile-02.png' },
    { img: 'assets/images/profile/profile-03.png' },
    { img: 'assets/images/profile/profile-04.png' }
  ];
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
  public testimonials: any[] = [];
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private categoryService: CategoryService,
    private toasty: ToastrService,
    private webinarService: WebinarService,
    private tutorService: TutorService,
    private testimonialService: TestimonialService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    const _categories = this.route.snapshot.data['categories'];
    const rowCategories = _categories.slice(0, 12);
    this.listCategories = _.chunk(rowCategories, 3);
    this.queryTestimonial();
  }

  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.config = this.route.snapshot.data.appConfig;
    if (this.config) {
      this.seoService.update(this.config.siteName, this.config.homeSEO);
    }

    if (this.authService.isLoggedin()) {
      this.authService.getCurrentUser().then(resp => (this.currentUser = resp));
    }
    this.queryWebinars();
    this.queryTutors();
  }

  queryWebinars() {
    const params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`,
        isOpen: true,
        tutorId: this.queryParams.tutorId || '',
        isAvailable: true,
        disabled: false
      },
      this.searchFields
    );

    this.webinarService
      .search(params)
      .then(resp => {
        this.webinars = resp.data.items;
        if (this.authService.isLoggedin())
          this.webinars.map(item => {
            this.webinarService.checkBooked(item._id, 'webinar').then((resp: any) => {
              item.booked = resp.data.booked;
            });
          });
      })
      .catch(() => alert(this.translate.instant('Something went wrong, please try again!')));
  }

  queryTutors() {
    const params = Object.assign({
      page: 0,
      take: 10,
      sort: 'createdAt',
      sortType: 'asc',
      isHomePage: true
    });

    this.tutorService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.tutors = resp.data.items;
      })
      .catch(() => alert(this.translate.instant('Something went wrong, please try again!')));
  }

  queryTestimonial() {
    this.testimonialService
      .search({ take: 50 })
      .then(resp => {
        const data = resp.data.items;
        if (data.length) {
          this.testimonials = data.map(item => Object.assign(item, { urlYoutube: this.setUrl(item.idYoutube) }));
          (function ($) {
            $(document).ready(function () {
              $('#testimonial-slider-nav').flexslider({
                animation: 'slide',
                controlNav: false,
                animationLoop: true,
                slideshow: true,
                itemWidth: 210,
                itemMargin: 5,
                asNavFor: '#testimonial-slider'
              });
              $('#testimonial-slider').flexslider({
                animation: 'fade',
                minItems: 1,
                slideshow: true,
                slideshowSpeed: 3000,
                animationSpeed: 600,
                useCSS: false,
                controlNav: false,
                sync: '#testimonial-slider-nav'
              });
            });
          })(jQuery);
        }
      })
      .catch(() => alert(this.translate.instant('Something went wrong, please try again!')));
  }

  selectCategory(category: any) {
    if (category && this.searchFields.categoryIds !== category._id) {
      this.searchFields.categoryIds = category._id || '';
      this.queryWebinars();
    } else if (!category && this.searchFields.categoryIds !== '') {
      this.searchFields.categoryIds = '';
      this.queryWebinars();
    }
    this.categoryName = category.name || '';
  }

  setUrl(idYoutube) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${idYoutube}`);
  }

  ngAfterViewInit() {}
}
