import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreateComponent } from './create/create.component';
import { UserListingComponent } from './list/listing.component';
import { UserUpdateComponent } from './update/update.component';
import { ProfileUpdateComponent } from './profile/profile-update.component';

const routes: Routes = [
  {
    path: 'profile/update', component: ProfileUpdateComponent,
    data: {
      title: 'Profile Update',
      urls: [{ title: 'Profile Update' }]
    }
  },
  { path: 'create', component: UserCreateComponent ,
  data: {
    title: 'Create New User',
    urls: [{ title: 'Users', url: '/users/list' }, { title: 'Listing' }]
  }
  },
  {
    path: 'list',
    component: UserListingComponent,
    data: {
      title: 'Users manager',
      urls: [{ title: 'Users',url: '/users/list' }, { title: 'Listing' }]
    }
  },
  {
    path: 'update/:id', component: UserUpdateComponent,
    data: {
      title: 'Users update',
      urls: [{ title: 'Users',url: '/users/list' }, { title: 'Update' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
