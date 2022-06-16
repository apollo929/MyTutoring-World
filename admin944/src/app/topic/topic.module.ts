import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopicRoutingModule } from './topic.routing';
import { MediaModule } from '../media/media.module';

import { TopicCreateComponent } from './create/create.component';
import { TopicListingComponent } from './list/list.component';
import { TopicUpdateComponent } from './update/update.component';

import { TopicService } from './topic.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from '../category/category.service';
import { SubjectService } from '../subject/subject.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, TopicRoutingModule, MediaModule, NgSelectModule],
  declarations: [TopicCreateComponent, TopicListingComponent, TopicUpdateComponent],
  providers: [TopicService, CategoryService, SubjectService],
  exports: [TopicListingComponent],
  entryComponents: []
})
export class TopicModule {}
