import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebinarCreateComponent } from './create/create.component';
import { WebinarListingComponent } from './list/list.component';
import { WebinarUpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: 'list',
    component: WebinarListingComponent,
    data: {
      title: 'Webinars manager',
      urls: [{ title: 'Webinars', url: '/webinars/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: WebinarUpdateComponent,
    data: {
      title: 'Webinars Update',
      urls: [{ title: 'Webinars', url: '/webinars/list' }, { title: 'Update' }]
    }
  },
  {
    path: 'create',
    component: WebinarCreateComponent,
    data: {
      title: 'Create New Webinar',
      urls: [{ title: 'Webinars', url: '/webinars/list' }, { title: 'Create' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebinarRoutingModule {}
