import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubjectCreateComponent } from './create/create.component';
import { SubjectListingComponent } from './list/listing.component';
import { SubjectUpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: 'list',
    component: SubjectListingComponent,
    data: {
      title: 'Subjects manager',
      urls: [{ title: 'Subjects', url: '/subjects/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: SubjectUpdateComponent,
    data: {
      title: 'Subjects Update',
      urls: [{ title: 'Subjects', url: '/subjects/list'}, { title: 'Update' } ]
    }
  },
  {
    path: 'create',
    component: SubjectCreateComponent,
    data: {
      title: 'Create New Subject',
      urls: [{ title: 'Subjects', url: '/subjects/list'}, { title: 'Create' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }
