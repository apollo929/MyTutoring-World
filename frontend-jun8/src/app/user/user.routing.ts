import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryResolver, ConfigResolver, SubjectsResolver } from '../shared/resolver';
import { PaymentGuard } from '../shared/guard/payment.guard';

import {
  ProfileUpdateComponent,
  DashboardComponent,
  WebinarListingComponent,
  WebinarCreateComponent,
  WebinarUpdateComponent,
  ListScheduleComponent,
  ScheduleDetailComponent,
  ScheduleComponent,
  ListLessonComponent,
  LessonDetailComponent,
  FavoriteComponent,
  MyCategoriesComponent,
  CourseListingComponent,
  CourseCreateComponent,
  CourseUpdateComponent,
  ListMyCourseComponent
} from './component';


import { StripeComponent } from './component/payment/stripe.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileUpdateComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'webinars',
    component: WebinarListingComponent,
    canActivate: [PaymentGuard],
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'webinars/create',
    component: WebinarCreateComponent,
    canActivate: [PaymentGuard],
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'webinars/:id',
    component: WebinarUpdateComponent,
    canActivate: [PaymentGuard],
    resolve: {
      appConfig: ConfigResolver
    }
  },
  ///////////////////////////

  {
    path: 'courses',
    component: CourseListingComponent,
    canActivate: [PaymentGuard],
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'courses/create',
    component: CourseCreateComponent,
    canActivate: [PaymentGuard],
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'courses/:id',
    component: CourseUpdateComponent,
    canActivate: [PaymentGuard],
    resolve: {
      appConfig: ConfigResolver
    }
  },




  ///////////////////////////
  {
    path: 'appointments',
    component: ListScheduleComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'appointments/:id',
    component: ScheduleDetailComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'favorites/:type',
    component: FavoriteComponent
  },
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [PaymentGuard],
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'my-course',
    component: ListMyCourseComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'lessons',
    component: ListLessonComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'lessons/:id',
    component: LessonDetailComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'my-categories',
    component: MyCategoriesComponent,
    resolve: {
      categories: CategoryResolver,
      appConfig: ConfigResolver
    }
  },
  {
    path: 'payment-connect',
    component: StripeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
