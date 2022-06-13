import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ListingRequestComponent,
  DetailRefundRequestComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: ListingRequestComponent
  },
  {
    path: 'request',
    component: ListingRequestComponent
  },
  {
    path: ':id',
    component: DetailRefundRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRoutingModule { }
