import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RefundRoutingModule } from './refund.routing';

import { ListingRequestComponent, DetailRefundRequestComponent } from './components';

import { RequestRefundService } from './services/request-refund.service';

@NgModule({
  imports: [CommonModule, FormsModule, RefundRoutingModule, NgbModule],
  declarations: [ListingRequestComponent, DetailRefundRequestComponent],
  providers: [RequestRefundService],
  exports: []
})
export class RefundModule {}
