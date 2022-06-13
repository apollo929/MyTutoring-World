import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WebinarRoutingModule } from './webinar.routing';
import { MediaModule } from '../media/media.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { WebinarListingComponent } from './list/list.component';
import { CardWebinarComponent } from './card-webinar/card-webinar.component';
import { StripeModalComponent } from './stripe/stripe.component';

import { WebinarService } from './webinar.service';
import { CategoryService, SubjectService, TopicService } from '../shared/services';
import { CalendarModule } from '../calendar/calendar.module';
import { DetailWebinarComponent } from './detail/detail.component';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    WebinarRoutingModule,
    MediaModule,
    NgSelectModule,
    CalendarModule,
    ReactiveFormsModule,
    ReviewModule,
    NgxStripeModule.forRoot(),
    UtilsModule,
    TranslateModule.forChild()
    // TutorModule
  ],
  declarations: [DetailWebinarComponent, WebinarListingComponent, CardWebinarComponent, StripeModalComponent],
  providers: [
    WebinarService,
    CategoryService,
    CalendarService,
    FavoriteService,
    CategoryResolver,
    GradeService,
    SubjectService,
    TopicService
  ],
  exports: [WebinarListingComponent, CardWebinarComponent],
  entryComponents: [StripeModalComponent]
})
export class WebinarModule {}
