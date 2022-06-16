import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigResolver } from '../shared/resolver';
import { TutorCreateComponent } from './create/create.component';
import { TutorListingComponent } from './list/listing.component';
import { TutorUpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: 'create',
    component: TutorCreateComponent,
    data: {
      title: 'Create New Tutor',
      urls: [{ title: 'Tutors', url: '/tutor/list' }, { title: 'Listing' }]
    },
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: 'list',
    component: TutorListingComponent,
    data: {
      title: 'Tutor manager',
      urls: [{ title: 'Tutors', url: '/tutor/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: TutorUpdateComponent,
    data: {
      title: 'Update tutor',
      urls: [{ title: 'Tutors', url: '/tutor/list' }, { title: 'Update' }]
    },
    resolve: {
      appConfig: ConfigResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorRoutingModule {}
