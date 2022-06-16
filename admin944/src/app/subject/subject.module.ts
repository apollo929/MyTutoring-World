import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SubjectRoutingModule } from './subject.routing';
import { MediaModule } from '../media/media.module';

import { SubjectCreateComponent } from './create/create.component';
import { SubjectListingComponent } from './list/listing.component';
import { SubjectUpdateComponent } from './update/update.component';

import { SubjectService } from './subject.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from '../category/category.service';
import { TopicModule } from '../topic/topic.module';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, SubjectRoutingModule, MediaModule, NgSelectModule, TopicModule],
  declarations: [SubjectCreateComponent, SubjectListingComponent, SubjectUpdateComponent],
  providers: [SubjectService, CategoryService],
  exports: [SubjectListingComponent],
  entryComponents: []
})
export class SubjectModule {}
