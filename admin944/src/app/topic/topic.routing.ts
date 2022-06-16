import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicCreateComponent } from './create/create.component';
import { TopicListingComponent } from './list/list.component';
import { TopicUpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: 'list',
    component: TopicListingComponent,
    data: {
      title: 'Topics manager',
      urls: [{ title: 'Topics', url: '/topics/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: TopicUpdateComponent,
    data: {
      title: 'Topics Update',
      urls: [{ title: 'Topics', url: '/topics/list' }, { title: 'Update' }]
    }
  },
  {
    path: 'create',
    component: TopicCreateComponent,
    data: {
      title: 'Create New Topic',
      urls: [{ title: 'Topics', url: '/topics/list' }, { title: 'Create' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule {}
