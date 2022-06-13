import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentSuccessComponent } from './components/success/success.component';
import { PaymentCancelComponent } from './components/cancel/cancel.component';
import { PayComponent } from './components/pay/pay.component';
import { ConfigResolver } from '../shared/resolver';
const routes: Routes = [
  {
    path: 'success',
    component: PaymentSuccessComponent
  },
  {
    path: 'cancel',
    component: PaymentCancelComponent
  },
  {
    path: 'pay',
    component: PayComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule {}
