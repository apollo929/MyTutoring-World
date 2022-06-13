import { ConfigResolver } from './../shared/resolver/config.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorProfileComponent, TutorListComponent, SubjectComponent } from './components';
import { TutorDetailResolver, TutorSearchResolver } from './resolver';
import { CategoryResolver, SubjectsResolver } from '../shared/resolver';

const routes: Routes = [
  {
    path: '',
    component: TutorListComponent,
    resolve: {
      // search: TutorSearchResolver,
      categories: CategoryResolver
    }
  },
  {
    path: 'subject',
    component: SubjectComponent,
    resolve: {
      subjects: SubjectsResolver,
      categories: CategoryResolver
    },
    data: {
      subjectId: ''
    }
  },
  {
    path: 'zipCode',
    component: TutorListComponent,
    data: {
      zipCode: ''
    }
  },
  {
    path: ':username',
    component: TutorProfileComponent,
    resolve: {
      tutor: TutorDetailResolver,
      appConfig: ConfigResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorRoutingModule {}
