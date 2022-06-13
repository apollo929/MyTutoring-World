import { ConfigResolver } from '../shared/resolver/config.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseListingComponent } from './list/list.component';
import { DetailCourseComponent } from './detail/detail.component';
import { CategoryResolver } from '../shared/resolver';
const routes: Routes = [
  {
    path: 'list',
    component: CourseListingComponent,
    data: {
      title: 'Courses manager',
      urls: [{ title: 'Courses', url: '/courses/list' }, { title: 'Listing' }]
    },
    resolve: {
      categories: CategoryResolver,
      appConfig: ConfigResolver
    }
  },
  {
    path: 'detail/:id',
    component: DetailCourseComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule {}
