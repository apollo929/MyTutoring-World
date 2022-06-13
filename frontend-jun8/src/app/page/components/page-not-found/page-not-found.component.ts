import { SeoService } from './../../../shared/services/seo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.html'
})
export class PageNotFoundComponent implements OnInit {
  constructor(private seoService: SeoService) {
    seoService.update('Page Not Found');
  }

  ngOnInit() {}
}
