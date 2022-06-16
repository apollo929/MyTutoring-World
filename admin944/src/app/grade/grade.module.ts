import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GradeRoutingModule } from './grade.routing';
import { MediaModule } from '../media/media.module';

import { GradeCreateComponent } from './create/create.component';
import { GradeListingComponent } from './list/listing.component';
import { GradeUpdateComponent } from './update/update.component';

import { GradeService } from './grade.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, GradeRoutingModule, MediaModule],
  declarations: [GradeCreateComponent, GradeListingComponent, GradeUpdateComponent],
  providers: [GradeService],
  exports: [],
  entryComponents: []
})
export class GradeModule {}
