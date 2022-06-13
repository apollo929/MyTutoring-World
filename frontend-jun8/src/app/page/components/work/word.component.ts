import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SeoService } from '../../../shared/services';
// import * as $ from 'jquery';
declare var jQuery: any;

@Component({
  selector: 'app-work',
  templateUrl: './word.html'
})
export class WorkComponent implements OnInit {
  public config: any;
  public iframe: any;
  constructor(
    public router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private seoService: SeoService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    seoService.update('How it works');
    this.config = this.route.snapshot.data['appConfig'];
  }
  ngOnInit() {
    this.iframe = this.setUrl(this.config.youtubeHowItWork);
  }

  setUrl(urlYoutubeHowItWork) {
    return this.sanitizer.bypassSecurityTrustHtml(urlYoutubeHowItWork);
  }
}
