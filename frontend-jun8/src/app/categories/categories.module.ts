import { TutorService } from './../tutor/services/tutor.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { CategoriesComponent } from './components';
import { CategoriesRoutingModule } from './categories.routing';
import { CategoryService, WebinarService } from '../shared/services';
import { WebinarModule } from '../webinar/webinar.module';
import { CategoryResolver } from '../shared/resolver';
import { NgxStripeModule } from 'ngx-stripe';
import { MediaModule } from '../media/media.module';
import { ReviewModule } from '../reviews/review.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ReviewModule,
    UtilsModule,
    TranslateModule.forChild(),
    NgxSmartModalModule.forChild(),
    NgxStripeModule.forRoot(),
    CategoriesRoutingModule,
    WebinarModule,
    SlickCarouselModule
  ],
  declarations: [CategoriesComponent],
  providers: [WebinarService, CategoryService, CategoryResolver, TutorService],
  exports: []
})
export class CategoriesModule {}
