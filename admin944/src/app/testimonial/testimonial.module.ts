import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestimonialRoutingModule } from './testimonial.routing';
import { MediaModule } from '../media/media.module';

import { TestimonialCreateComponent } from './create/create.component';
import { TestimonialListingComponent } from './list/listing.component';
import { TestimonialUpdateComponent } from './update/update.component';

import { TestimonialService } from './testimonial.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, TestimonialRoutingModule, MediaModule],
  declarations: [TestimonialCreateComponent, TestimonialListingComponent, TestimonialUpdateComponent],
  providers: [TestimonialService],
  exports: [],
  entryComponents: []
})
export class TestimonialModule {}
