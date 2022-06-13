import { ConfigResolver } from '../shared/resolver/config.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebinarListingComponent } from './list/list.component';
import { DetailWebinarComponent } from './detail/detail.component';
import { CategoryResolver } from '../shared/resolver';
const routes: Routes = [
  {
    path: 'list',
    component: WebinarListingComponent,
    data: {
      title: 'Webinars manager',
      urls: [{ title: 'Webinars', url: '/webinars/list' }, { title: 'Listing' }]
    },
    resolve: {
      categories: CategoryResolver,
      appConfig: ConfigResolver
    }
  },
  {
    path: 'detail/:id',
    component: DetailWebinarComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebinarRoutingModule {}
