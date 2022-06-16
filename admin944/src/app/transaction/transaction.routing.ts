import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  TransactionListComponent,
  TransactionDetailComponent
} from './components';

const routes: Routes = [{
  path: 'transaction',
  component: TransactionListComponent,
  data: {
    title: 'Transaction manager'
  }
}, {
  path: 'transaction/:id',
  component: TransactionDetailComponent,
  data: {
    title: 'Transaction detail',
    urls: [{
      title: 'Listing',
      url: '/transaction'
    }, {
      title: 'Detail'
    }]
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
