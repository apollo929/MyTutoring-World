import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../appointment/services/appointment.service';
import { TransactionService } from './services/transaction.service';
import { ListTransactionComponent, AppointmentDetailComponent } from './components';
import { ReviewModule } from '../reviews/review.module';
import { RequestRefundService } from '../refund/services/request-refund.service';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigResolver } from '../shared/resolver';
const routes: Routes = [
  {
    path: 'list',
    component: ListTransactionComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  },
  {
    path: ':id',
    component: AppointmentDetailComponent,
    resolve: {
      appConfig: ConfigResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ReviewModule,
    UtilsModule,
    TranslateModule.forChild()
  ],
  declarations: [ListTransactionComponent, AppointmentDetailComponent],
  providers: [AppointmentService, TransactionService, RequestRefundService],
  exports: [ListTransactionComponent, AppointmentDetailComponent]
})
export class TransactionModule {}
