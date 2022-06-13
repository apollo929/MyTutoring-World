import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkComponent } from './components/work/word.component';
import { TeachWithUsComponent } from './components/teach/teach.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { ConfigResolver } from '../shared/resolver';

const routes: Routes = [
  {
    path: 'how-does-it-work',
    component: WorkComponent
  },
  {
    path: 'teach-with-us',
    component: TeachWithUsComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: '404-not-found',
    component: PageNotFoundComponent
  },
  {
    path: 'error/:code',
    component: PageErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {}
