import { SeoService } from './../../../shared/services/seo.service';
import { TutorService } from './../../../tutor/services/tutor.service';
import { IUser } from './../../../user/interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { WebinarService } from '../../../webinar/webinar.service';
import { ICategory } from '../../interface';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  templateUrl: './categories.html'
})
export class CategoriesComponent implements OnInit {
  public page: any = 1;
  public pageSize: number = 4;
  public webinars: any = [];
  public total: any = 0;
  public sort: any = '';
  public sortType: any = '';
  public categories: ICategory[] = [];
  public categoriesDisplay: any = [];
  public categoryIds: any = [];
  public isAllCheck: boolean = true;
  public categoryCheckList: any[] = [];
  public categoryInput: string = '';
  public tutors: IUser[] = [];
  public searchFields: any = {
    categoryIds: ''
  };
  public loading: boolean = false;
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

  constructor(
    private webinarsService: WebinarService,
    private route: ActivatedRoute,
    private router: Router,
    private tutorService: TutorService,
    private seoService: SeoService,
    private translate: TranslateService
  ) {
    seoService.update('Categories');
    this.route.queryParams.subscribe(params => {
      this.searchFields = Object.assign(this.searchFields, params);
      if (params.categoryIds && params.categoryIds.length) {
        this.categoryIds = [];
        params.categoryIds.split(',').forEach(id => {
          this.categoryIds.push(id);
          this.isAllCheck = false;
        });
      }
      this.query();
    });
  }
  ngOnInit() {
    const cate_data = this.route.snapshot.data['categories'];
    if (cate_data) {
      this.categories = this.categoriesDisplay = cate_data;
    }
    this.queryTutors();
  }

  query() {
    let params = Object.assign(
      {
        page: this.page,
        take: this.pageSize,
        sort: this.sort,
        sortType: this.sortType
      },
      this.searchFields
    );

    if (!this.loading) {
      this.loading = true;
      this.webinarsService
        .search(params)
        .then(resp => {
          this.total = resp.data.count;
          this.webinars = resp.data.items;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          alert(this.translate.instant('Something went wrong, please try again!'));
        });
    }
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
        this.tutors = resp.data.items;
      })
      .catch(() => alert(this.translate.instant('Something went wrong, please try again!')));
  }

  categoryChange(id: string, isAll: boolean = false) {
    if (!id) {
      this.isAllCheck = true;
      this.searchFields.categoryIds = '';
      this.categoryIds = [];
    } else {
      this.isAllCheck = false;
      const index = this.categoryIds.indexOf(id);
      if (index !== -1) {
        this.categoryIds.splice(index, 1);
      } else {
        this.categoryIds.push(id);
      }
      this.searchFields.categoryIds = this.categoryIds.join(',');
    }
    if (!this.categoryIds.length) {
      this.isAllCheck = true;
    }
    this.router.navigate(['/categories'], {
      queryParams: { categoryIds: this.searchFields.categoryIds }
    });
    this.query();
  }

  search(event: any) {
    this.categoriesDisplay = [];
    if (this.categoryInput === '') {
      this.categoriesDisplay = this.categories;
    } else {
      this.categories.forEach(element => {
        if (element.name.toLocaleLowerCase('en-US').includes(this.categoryInput.toLocaleLowerCase('en-US')))
          this.categoriesDisplay.push(element);
      });
    }
  }

  pageChange() {
    $('html, body').animate({ scrollTop: 0 });
    this.query();
  }
}
