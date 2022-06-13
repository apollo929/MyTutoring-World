import { SeoService } from './../../../shared/services/seo.service';
import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TutorService } from '../../../tutor/services/tutor.service';
declare var jQuery: any;
@Component({
  selector: 'app-teach-with-us',
  templateUrl: './teach.html'
})
export class TeachWithUsComponent implements OnInit {
  public tutors: any[];
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
  constructor(
    public router: Router,
    private tutorService: TutorService,
    private authService: AuthService,
    private seoService: SeoService,
    private route: ActivatedRoute
  ) {
    seoService.update('Teach with us');
    this.config = this.route.snapshot.data['appConfig'];
  }

  ngOnInit() {
    (function ($) {
      $(document).ready(function () {
        $('.counter').each(function () {
          const $this = $(this);
          const countTo = $this.attr('data-count');

          $({ countNum: $this.text() }).animate(
            {
              countNum: countTo
            },

            {
              duration: 8000,
              easing: 'linear',
              step: function () {
                $this.text(Math.floor(this.countNum));
              },
              complete: function () {
                $this.text(this.countNum);
              }
            }
          );
        });
      });
    })(jQuery);
    this.queryTutors();
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
      .catch(() => alert('Something went wrong, please try again!'));
  }

  becomeInstructor() {
    this.authService.removeToken();
    this.router.navigate(['/auth/sign-up']);
  }
}
