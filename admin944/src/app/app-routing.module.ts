import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { AuthLayoutComponent } from './layouts/auth/auth.component';

import { AuthGuard } from './shared/guard/auth.guard';
import { ConfigResolver } from './shared/resolver';

export const Approutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    resolve: { appConfig: ConfigResolver },
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
    ]
  },
  {
    path: '',
    component: FullComponent,
    resolve: { appConfig: ConfigResolver },
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      {
        path: 'starter',
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule),
        resolve: { appConfig: ConfigResolver }
      },
      { path: 'users', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'banners', loadChildren: './banner/banner.module#BannerModule' },
      { path: 'i18n', loadChildren: './i18n/i18n.module#I18nModule' },
      { path: 'tutor', loadChildren: './tutor/tutor.module#TutorModule', resolve: { appConfig: ConfigResolver } },
      {
        path: 'appointment',
        loadChildren: './appointment/appointment.module#AppointmentModule',
        resolve: { appConfig: ConfigResolver }
      },
      { path: 'subjects', loadChildren: './subject/subject.module#SubjectModule' },
      { path: 'grades', loadChildren: './grade/grade.module#GradeModule' },
      { path: 'newsletter', loadChildren: './newsletter/newsletter.module#NewsletterModule' },
      { path: 'posts', loadChildren: './post/post.module#PostModule' },
      {
        path: 'payment',
        loadChildren: './transaction/transaction.module#TransactionModule',
        resolve: { appConfig: ConfigResolver }
      },
      { path: 'configs', loadChildren: './config/config.module#ConfigModule' },
      // {
      //   path: 'payout/requests',
      //   loadChildren: './payout/request-payout.module#RequestPayoutModule',
      //   resolve: { appConfig: ConfigResolver }
      // },
      { path: 'categories', loadChildren: './category/category.module#CategoryModule' },
      {
        path: 'webinars',
        loadChildren: './webinar/webinar.module#WebinarModule',
        resolve: { appConfig: ConfigResolver }
      },
      { path: 'coupons', loadChildren: './coupon/coupon.module#CouponModule', resolve: { appConfig: ConfigResolver } },
      { path: 'testimonials', loadChildren: './testimonial/testimonial.module#TestimonialModule' },
      { path: 'refunds', loadChildren: './refund/refund.module#RefundModule', resolve: { appConfig: ConfigResolver } },
      {
        path: 'earnings',
        loadChildren: './earning-stats/earning-stats.module#EarningStatsModule',
        resolve: { appConfig: ConfigResolver }
      },
      { path: 'i18n', loadChildren: './i18n/i18n.module#I18nModule' },
      { path: 'topics', loadChildren: './topic/topic.module#TopicModule' }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
