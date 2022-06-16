import { TutorService } from '../tutor/tutor.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WebinarRoutingModule } from './webinar.routing';
import { MediaModule } from '../media/media.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';

import { WebinarCreateComponent } from './create/create.component';
import { WebinarListingComponent } from './list/list.component';
import { WebinarUpdateComponent } from './update/update.component';

import { WebinarService } from './webinar.service';
import { CategoryService } from '../category/category.service';
import { CalendarModule } from '../calendar/calendar.module';
import { CalendarService } from '../calendar/services/calendar.service';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { GradeService } from '../grade/grade.service';
import { from } from 'rxjs';
import { MyCategoryService } from '../shared/services/my-category.service';
import { MySubjectService } from '../shared/services/my-subject.service';
import { MyTopicService } from '../shared/services/my-topic.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    WebinarRoutingModule,
    MediaModule,
    NgSelectModule,
    CalendarModule,
    FroalaEditorModule,
    QuillModule.forRoot()
  ],
  declarations: [WebinarCreateComponent, WebinarListingComponent, WebinarUpdateComponent],
  providers: [
    WebinarService,
    CategoryService,
    CalendarService,
    TutorService,
    GradeService,
    MyCategoryService,
    MySubjectService,
    MyTopicService
  ],
  exports: [],
  entryComponents: []
})
export class WebinarModule {}
