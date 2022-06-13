import { DTSService } from './../shared/services/dts.service';
import { ConfigResolver } from './../shared/resolver/config.resolver';
import { MySubjectService } from './../shared/services/my-subject.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from '../calendar/calendar.module';
import { ReviewModule } from '../reviews/review.module';
import { UtilService } from '../shared/services/utils.service';
import { NgxStripeModule } from 'ngx-stripe';

import { SuccessComponent, CancelComponent, AppointmentDetailComponent, ConfirmModalComponent } from './components';
import { BookingComponent } from './components/booking/booking.component';
import { AppointmentService } from './services/appointment.service';
import { TutorService } from '../tutor/services/tutor.service';
import { CalendarService } from '../calendar/services/calendar.service';

import { SubjectsResolver } from '../shared/resolver';
import { TutorDetailResolver } from '../tutor/resolver/detail.resolver';
import { UtilsModule } from '../utils/utils.module';
import { MyCategoryService, MyTopicService, WebinarService } from '../shared/services';
import { WebinarModule } from '../webinar/webinar.module';
import { FavoriteService } from '../shared/services';
import { MessageModule } from '../message/message.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: ':username',
    component: BookingComponent,
    resolve: {
      tutor: TutorDetailResolver,
      appConfig: ConfigResolver
    },
    data: {
      isFree: false
    }
  },
  {
    path: ':username/success',
    component: SuccessComponent,
    resolve: {
      tutor: TutorDetailResolver
    }
  },
  {
    path: ':username/cancel',
    component: CancelComponent,
    resolve: {
      tutor: TutorDetailResolver
    }
  },
  {
    path: ':id/reviews',
    component: AppointmentDetailComponent,
    resolve: {
      tutor: TutorDetailResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    CalendarModule,
    ReviewModule,
    NgxStripeModule.forRoot(),
    UtilsModule,
    WebinarModule,
    MessageModule,
    TranslateModule.forChild()
  ],
  declarations: [
    BookingComponent,
    SuccessComponent,
    CancelComponent,
    AppointmentDetailComponent,
    ConfirmModalComponent
  ],
  providers: [
    AppointmentService,
    SubjectsResolver,
    TutorDetailResolver,
    TutorService,
    CalendarService,
    UtilService,
    WebinarService,
    FavoriteService,
    MySubjectService,
    MyCategoryService,
    MyTopicService,
    DTSService
  ],
  entryComponents: [ConfirmModalComponent]
})
export class AppointmentModule {}
