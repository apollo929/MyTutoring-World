import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { DashboardLayoutComponent } from './layouts/dashboard/dashboard.component';

import { AuthGuard } from './shared/guard/auth.guard';
import { ConfigResolver, LanguageResolver, SubjectsResolver, PostsResolver, CategoryResolver } from './shared/resolver';
// import { applySourceSpanToStatementIfNeeded } from '@angular/compiler/src/output/output_ast';
// import { WebinarListingComponent } from './safety/list.component';


export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    resolve: {
      appConfig: ConfigResolver,
      language: LanguageResolver,
      subjects: SubjectsResolver,
      posts: PostsResolver,
      categories: CategoryResolver
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
      },
      {
        path: 'tutors',
        children: [{ path: '', loadChildren: () => import('./tutor/tutor.module').then(m => m.TutorModule) }],
        resolve: {
          subjects: SubjectsResolver,
          appconfig: ConfigResolver
        }
      },
      {
        path: 'posts',
        loadChildren: () => import('./post/post.module').then(m => m.PostModule)
      },
      {
        path: 'pages',
        loadChildren: () => import('./page/page.module').then(m => m.PageModule),
        resolve: {
          appConfig: ConfigResolver
        }
      },
      {
        path: 'webinars',
        loadChildren: () => import('./webinar/webinar.module').then(m => m.WebinarModule),
        resolve: {
          appConfig: ConfigResolver
        }
      },
      {
        path: 'courses',
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
        resolve: {
          appConfig: ConfigResolver
        }
      },
      {
        path: 'payments',
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
        resolve: {
          appConfig: ConfigResolver
        }
      },
      {
        path: 'appointments',
        resolve: {
          appConfig: ConfigResolver
        },
        loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
        resolve: {
          categories: CategoryResolver,
          appConfig: ConfigResolver
        }
      }
    ]
  },
  {
    path: 'users',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    resolve: {
      appConfig: ConfigResolver,
      language: LanguageResolver,
      subjects: SubjectsResolver,
      posts: PostsResolver
    },
    children: [
      { path: '', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      {
        path: 'payout',
        loadChildren: () => import('./payout/payout.module').then(m => m.PayoutModule),
        resolve: {
          appConfig: ConfigResolver
        }
      },
      {
        path: 'refund',
        loadChildren: () => import('./refund/refund.module').then(m => m.RefundModule),
        resolve: {
          appConfig: ConfigResolver
        }
      },
      {
        path: 'transaction',
        loadChildren: () => import('./transactions/transaction.module').then(m => m.TransactionModule),
        resolve: {
          appConfig: ConfigResolver
        }
      },
      {
        path: 'messages',
        canActivate: [AuthGuard],
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule)
      }
    ]
  },
  {
    path: 'auth',
    component: BlankComponent,
    resolve: { appConfig: ConfigResolver, language: LanguageResolver },
    children: [{ path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }]
  },
  {
    path: 'safety',
    component: BlankComponent,
    resolve: { appConfig: ConfigResolver, language: LanguageResolver },
    children: [{ path: '', loadChildren: () => import('./safety/safety.module').then(m => m.SafetyModule) }]
  },

 
  {
    path: '**',
    redirectTo: '/'
  }
];
