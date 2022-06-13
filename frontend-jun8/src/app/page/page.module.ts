import { NgModule, PipeTransform, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageRoutingModule } from './page.routing';

import { PricingComponent } from './components/pricing/pricing.component';
import { WorkComponent } from './components/work/word.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { TeachWithUsComponent } from './components/teach/teach.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TutorService } from '../tutor/services/tutor.service';
import { ReviewModule } from '../reviews/review.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageErrorComponent } from './components/page-error/page-error.component';
import { UtilsModule } from '../utils/utils.module';
import { TextEllipsisComponent } from '../utils/components';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    PageRoutingModule,
    NgxSmartModalModule.forChild(),
    SlickCarouselModule,
    ReviewModule,
    UtilsModule,
    TranslateModule.forChild()
  ],
  declarations: [PricingComponent, WorkComponent, TeachWithUsComponent, PageNotFoundComponent, PageErrorComponent],
  providers: [TutorService, TextEllipsisComponent],
  exports: [],
  entryComponents: []
})
export class PageModule {}
