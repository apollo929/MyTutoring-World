import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AppointmentListingComponent,
  AppointmentDetailComponent
} from './components';

const routes: Routes = [{
  path: 'list',
  component: AppointmentListingComponent,
  data: {
    title: 'Appointment manager',
    urls: [{
      title: 'Appointment',
      url: '/appointment/list'
    }, {
      title: 'Listing'
    }]
  }
}, {
  path: 'detail/:id',
  component: AppointmentDetailComponent,
  data: {
    title: 'Appointment detail',
    urls: [{
      title: 'Appointment',
      url: '/appointment/list'
    }, {
      title: 'Detail'
    }]
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
