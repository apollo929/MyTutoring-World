import { SeoService } from './../../../shared/services/seo.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { PostService } from '../../../shared/services/posts.service';
import { IPost } from '../../interface';
@Component({
  selector: 'detail-post',
  templateUrl: './detail.html'
})
export class PostDetailComponent implements OnInit {
  public post: IPost = {};
  private alias: any;
  public submitted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private seoSerivice: SeoService
  ) {
    this.route.params.subscribe(params => {
      this.alias = params.alias;
      this.postService.findOne(this.alias).then(resp => {
        this.post = _.pick(resp.data, ['title', 'alias', 'content', 'type']);
        this.seoSerivice.update(this.post.title);
      });
    });
  }
  ngOnInit() {}
}
