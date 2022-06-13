import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PayoutRoutingModule } from './payout.routing';
import { UtilsModule } from '../utils/utils.module';

import {
  ListingRequestComponent,
  ListingAccountsComponent,
  CreateRequestPayoutComponent,
  AccountUpdateComponent,
  AccountCreateComponent,
  PayoutMenuComponent
} from './components';

import { RequestPayoutService, AccountService } from './services';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentModule } from '../appointment/appointment.module';
import { AccountResolver } from '../shared/resolver/account.resolver';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PayoutRoutingModule,
    NgbModule,
    UtilsModule,
    TranslateModule.forChild(),
    AppointmentModule,
    NgxChartsModule
  ],
  declarations: [
    ListingAccountsComponent,
    ListingRequestComponent,
    AccountUpdateComponent,
    CreateRequestPayoutComponent,
    AccountCreateComponent,
    PayoutMenuComponent
  ],
  providers: [RequestPayoutService, AccountService, AccountResolver],
  exports: []
})
export class PayoutModule {}
