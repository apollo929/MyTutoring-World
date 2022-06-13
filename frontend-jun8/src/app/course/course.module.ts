import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseRoutingModule } from './course.routing';
import { MediaModule } from '../media/media.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { CourseListingComponent } from './list/list.component';
import { CardCourseComponent } from './card-course/card-course.component';
import { StripeModalComponent } from './stripe/stripe.component';

import { CourseService } from './course.service';
import { CategoryService, SubjectService, TopicService } from '../shared/services';
import { CalendarModule } from '../calendar/calendar.module';
import { DetailCourseComponent } from './detail/detail.component';
import { CalendarService } from '../calendar/services/calendar.service';
import { NgxStripeModule } from 'ngx-stripe';
import { ReviewModule } from '../reviews/review.module';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';
import { TutorModule } from '../tutor/tutor.module';
import { FavoriteService } from '../shared/services';
import { CategoryResolver } from '../shared/resolver';
import { GradeService } from '../tutor/services/grade.service';
import { from } from 'rxjs';
import { LectureService } from 'app/shared/services/lecture.service';
import { LectureSectionService } from 'app/shared/services/lecture-section.service';
import { ProgressService } from 'app/shared/services/progress.service';
import { ModalLectureWatch } from './modal-lecture-watch/modal-lecture-watch';
import { SafePipe } from 'app/safe.pipe';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CourseRoutingModule,
    MediaModule,
    NgSelectModule,
    CalendarModule,
    ReactiveFormsModule,
    ReviewModule,
    // PdfViewerModule,
    NgxExtendedPdfViewerModule,
    NgxStripeModule.forRoot(),
    UtilsModule,
    TranslateModule.forChild()
    // TutorModule
  ],
  declarations: [SafePipe, DetailCourseComponent, ModalLectureWatch, CourseListingComponent, CardCourseComponent, StripeModalComponent],
  providers: [
    CourseService,
    CategoryService,
    CalendarService,
    FavoriteService,
    CategoryResolver,
    GradeService,
    SubjectService,
    TopicService,
    LectureService,
    LectureSectionService,
    ProgressService
  ],
  exports: [CourseListingComponent, ModalLectureWatch, CardCourseComponent, SafePipe],
  entryComponents: [StripeModalComponent]
})
export class CourseModule { }
