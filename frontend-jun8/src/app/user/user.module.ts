import { CountryService } from './../shared/services/country.service';
import { MySubjectService } from './../shared/services/my-subject.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule } from './user.routing';

import { MediaModule } from '../media/media.module';
import { UtilsModule } from '../utils/utils.module';
import { CalendarModule } from '../calendar/calendar.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReviewModule } from '../reviews/review.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import {
  ProfileUpdateComponent,
  DashboardComponent,
  TutorGradeComponent,
  WebinarCreateComponent,
  WebinarUpdateComponent,
  WebinarListingComponent,
  ListScheduleComponent,
  ScheduleDetailComponent,
  ScheduleComponent,
  ListLessonComponent,
  LessonDetailComponent,
  FavoriteComponent,
  MyCategoriesComponent,
  MyCategoryFormComponent,
  MySubjectFormComponent,
  MyTopicFormComponent,
  ModalAppointment,
  CourseCreateComponent,
  CourseUpdateComponent,
  CourseListingComponent,
  ListMyCourseComponent
} from './component';
import {
  WebinarService,
  CategoryService,
  AppointmentService,
  FavoriteService,
  SectionService,
  MyCategoryService,
  MyTopicService,
  TopicService,
  SubjectService
} from '../shared/services';
import { UserService } from './services/user.service';
import { TutorService } from '../tutor/services/tutor.service';
import { RequestRefundService } from '../refund/services/request-refund.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GradeService } from '../tutor/services/grade.service';
import { CalendarService } from '../calendar/services/calendar.service';
import { TranslateModule } from '@ngx-translate/core';
import { TutorModule } from '../tutor/tutor.module';
import { WebinarModule } from '../webinar/webinar.module';
import { CategoryResolver, ConfigResolver } from '../shared/resolver';
import { TransactionService } from '../transactions/services/transaction.service';
import { QuillModule } from 'ngx-quill';
import { ParticipantFormComponent } from './component/webinar/modal-participants/participants-form';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { StripeServiceAccount } from './services/stripe.service';
import { StripeComponent } from './component/payment/stripe.component';
import { PaymentGuard } from '../shared/guard/payment.guard';
import { CourseService } from 'app/shared/services/course.service';
import { CourseModule } from 'app/course/course.module';
import { ModalLectureSection } from './component/course/modal-lecture-section/modal-lecture-section';
import { ModalLecture } from './component/course/modal-lecture/modal-lecture';
import { LectureService } from 'app/shared/services/lecture.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // our custom module
    UserRoutingModule,
    NgbModule,
    MediaModule,
    UtilsModule,
    NgSelectModule,
    CalendarModule,
    ShareButtonModule,
    ReviewModule,
    TooltipModule.forRoot(),
    CKEditorModule,
    TranslateModule.forChild(),
    TutorModule,
    WebinarModule,
    CourseModule,
    NgxExtendedPdfViewerModule,
    QuillModule.forRoot(),
  ],
  declarations: [
    ProfileUpdateComponent,
    DashboardComponent,
    TutorGradeComponent,
    WebinarCreateComponent,
    WebinarUpdateComponent,
    WebinarListingComponent,
    CourseCreateComponent,
    CourseUpdateComponent,
    CourseListingComponent,
    ListScheduleComponent,
    ScheduleDetailComponent,
    ScheduleComponent,
    ListMyCourseComponent,
    ListLessonComponent,
    LessonDetailComponent,
    FavoriteComponent,
    ParticipantFormComponent,
    MySubjectFormComponent,
    MyCategoriesComponent,
    MyCategoryFormComponent,
    MyTopicFormComponent,
    ModalAppointment,
    StripeComponent,
    ModalLectureSection,
    ModalLecture
  ],
  providers: [
    UserService,
    TutorService,
    TutorGradeComponent,
    GradeService,
    WebinarService,
    CategoryService,
    RequestRefundService,
    AppointmentService,
    CalendarService,
    FavoriteService,
    SectionService,
    CategoryResolver,
    TransactionService,
    ConfigResolver,
    CountryService,
    CourseService,
    GradeService,
    MySubjectService,
    MyCategoryService,
    MySubjectService,
    MyTopicService,
    TopicService,
    SubjectService,
    StripeServiceAccount,
    PaymentGuard,
    LectureService
  ],
  exports: [],
  entryComponents: [ParticipantFormComponent]
})
export class UserModule { }
