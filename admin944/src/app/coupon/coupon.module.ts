import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CouponRoutingModule } from './coupon.routing';
import { MediaModule } from '../media/media.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { CouponCreateComponent } from './create/create.component';
import { CouponListingComponent } from './list/list.component';
import { CouponUpdateComponent } from './update/update.component';

import { CouponService } from './coupon.service';
import { TutorService } from '../tutor/tutor.service';
import { WebinarService } from '../webinar/webinar.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, CouponRoutingModule, MediaModule, NgSelectModule],
  declarations: [CouponCreateComponent, CouponListingComponent, CouponUpdateComponent],
  providers: [CouponService, TutorService, WebinarService],
  exports: [],
  entryComponents: []
})
export class CouponModule {}
