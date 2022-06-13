import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CreateReviewComponent, ReviewListComponent, ReviewUpdateComponent, StarRatingComponent } from './components';
import { ReviewService } from './services/review.service';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';
const routes: Routes = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UtilsModule,
    TranslateModule.forChild()
  ],
  declarations: [CreateReviewComponent, ReviewListComponent, ReviewUpdateComponent, StarRatingComponent],
  providers: [ReviewService],
  exports: [CreateReviewComponent, ReviewListComponent, ReviewUpdateComponent, StarRatingComponent],
  entryComponents: [ReviewUpdateComponent]
})
export class ReviewModule {}
