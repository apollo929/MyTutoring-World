import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { PostService } from '../services';

@Injectable()
export class PostsResolver implements Resolve<Observable<any>> {
  constructor(private postService: PostService) {}

  resolve(): any {
    return this.postService.getPosts({ take: 100 }).then(resp => resp.data && resp.data.items);
  }
}
