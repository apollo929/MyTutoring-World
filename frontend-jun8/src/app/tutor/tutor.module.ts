import { CountryService } from './../shared/services/country.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewModule } from '../reviews/review.module';
import { WebinarModule } from '../webinar/webinar.module';
import { MessageModule } from '../message/message.module';
import {
  TutorProfileComponent,
  TutorListComponent,
  TutorCardComponent,
  TutorGradeComponent,
  ReviewTutorComponent,
  CertificateComponent,
  SubjectComponent,
  AddCetificationComponent
} from './components';
import { TutorService } from './services/tutor.service';
import { GradeService } from './services/grade.service';
import { ReviewService } from '../reviews/services/review.service';
import { TutorDetailResolver, TutorSearchResolver } from './resolver';
import { WebinarService, CategoryService, SubjectService, TopicService } from '../shared/services';
import { CalendarModule } from '../calendar/calendar.module';
import { TutorRoutingModule } from './tutor.routing';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MediaModule } from '../media/media.module';
import { FavoriteService } from '../shared/services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TutorRoutingModule,
    NgbModule,
    CalendarModule,
    ReviewModule,
    WebinarModule,
    UtilsModule,
    TranslateModule.forChild(),
    NgxSmartModalModule.forChild(),
    SlickCarouselModule,
    MediaModule,
    MessageModule,
    ShareButtonModule,
    ShareIconsModule
  ],
  declarations: [
    TutorProfileComponent,
    TutorListComponent,
    TutorCardComponent,
    TutorGradeComponent,
    ReviewTutorComponent,
    CertificateComponent,
    SubjectComponent,
    AddCetificationComponent
  ],
  providers: [
    TutorService,
    TutorDetailResolver,
    TutorSearchResolver,
    TutorGradeComponent,
    WebinarService,
    GradeService,
    ReviewService,
    FavoriteService,
    CountryService,
    SubjectService,
    TopicService
  ],
  exports: [TutorGradeComponent, ReviewTutorComponent, TutorCardComponent]
})
export class TutorModule {}
