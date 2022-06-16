import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TutorRoutingModule } from './tutor.routing';
import { MediaModule } from '../media/media.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { TutorCreateComponent } from './create/create.component';
import { TutorListingComponent } from './list/listing.component';
import { TutorUpdateComponent, RejectComponent } from './update/update.component';
import { ProfileCardCustomComponent } from './profile-card/profile-card.component';
import { TutorGradeComponent } from './grades/grade.component';

import { TutorService } from './tutor.service';
import { SubjectService } from '.././subject/subject.service';
import { ReviewModule } from '../reviews/review.module';
import { AddCetificationComponent } from './add-certification/add.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocumentModalComponent } from './view-document-modal/view-document.componet';
import { TimezoneComponent } from './timezone.component';
import { MyCategoryService } from '../shared/services/my-category.service';
import { MySubjectService } from '../shared/services/my-subject.service';
import { MyTopicService } from '../shared/services/my-topic.service';
import { TopicService } from '../topic/topic.service';
import { CategoryService } from '../category/category.service';
import { MyCategoryFormComponent } from './modal-create-category/modal';
import { MySubjectFormComponent } from './modal-mysubject/my-subject';
import { MyTopicFormComponent } from './modal-create-topic/modal';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TutorRoutingModule,
    NgbModule,
    MediaModule,
    NgSelectModule,
    ReviewModule,
    QuillModule.forRoot(),
    NgxExtendedPdfViewerModule,
    NgxDocViewerModule
  ],
  declarations: [
    TutorCreateComponent,
    TutorListingComponent,
    TutorUpdateComponent,
    ProfileCardCustomComponent,
    TutorGradeComponent,
    RejectComponent,
    AddCetificationComponent,
    DocumentModalComponent,
    TimezoneComponent,
    MyCategoryFormComponent,
    MySubjectFormComponent,
    MyTopicFormComponent
  ],
  providers: [
    TutorService,
    SubjectService,
    MyCategoryService,
    MySubjectService,
    MyTopicService,
    TopicService,
    CategoryService
  ],
  exports: [ProfileCardCustomComponent],
  entryComponents: [RejectComponent]
})
export class TutorModule {}
