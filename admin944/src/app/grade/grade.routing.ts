import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GradeCreateComponent } from './create/create.component';
import { GradeListingComponent } from './list/listing.component';
import { GradeUpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: 'list',
    component: GradeListingComponent,
    data: {
      title: 'Grades manager',
      urls: [{ title: 'Grades', url: '/grades/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id',
    component: GradeUpdateComponent,
    data: {
      title: 'Grades Update',
      urls: [{ title: 'Grades', url: '/grades/list' }, { title: 'Update' }]
    }
  },
  {
    path: 'create',
    component: GradeCreateComponent,
    data: {
      title: 'Create New Grade',
      urls: [{ title: 'Grades', url: '/grades/list' }, { title: 'Create' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeRoutingModule { }
