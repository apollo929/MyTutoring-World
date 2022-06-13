import { SeoService } from './../../../shared/services/seo.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'page-error',
  templateUrl: './page-error.html'
})
export class PageErrorComponent implements OnInit {
  public code: any;
  constructor(private route: ActivatedRoute, private seoService: SeoService) {
    seoService.update('Page error');
    this.code = this.route.snapshot.params.code;
  }

  ngOnInit() {}
}
