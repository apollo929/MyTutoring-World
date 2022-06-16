import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PostUpdateComponent,
  PostListComponent,
  PostCreateComponent
} from './components';

const routes: Routes = [{
  path: 'list',
  component: PostListComponent,
  data: {
    title: 'Post manager'
  }
}, {
  path: 'update/:id',
  component: PostUpdateComponent,
  data: {
    title: 'Post update',
    urls: [{
      title: 'Listing',
      url: '/posts/list'
    }, {
      title: 'Update'
    }]
  }
},
{
  path: 'create',
  component: PostCreateComponent,
  data: {
    title: 'Create New Post',
    urls: [{
      title: 'Listing',
      url: '/posts/list'
    }, {
      title: 'Create'
    }]
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
