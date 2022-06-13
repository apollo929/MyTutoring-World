import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MediaModule } from '../media/media.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentRoutingModule } from '../payment/payment.routing';
import { PaymentSuccessComponent } from './components/success/success.component';
import { PaymentCancelComponent } from './components/cancel/cancel.component';
import { PayComponent } from './components/pay/pay.component';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxStripeModule } from 'ngx-stripe';
import { AuthService } from '../shared/services';
import { WebinarService } from '../webinar/webinar.service';
import { AppointmentService } from '../appointment/services/appointment.service';
import { PaymentService } from './payment.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    PaymentRoutingModule,
    MediaModule,
    NgSelectModule,
    UtilsModule,
    TranslateModule.forChild(),
    NgxStripeModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [PaymentSuccessComponent, PaymentCancelComponent, PayComponent],
  providers: [AuthService, WebinarService, AppointmentService, PaymentService],
  exports: [],
  entryComponents: []
})
export class PaymentModule {}
