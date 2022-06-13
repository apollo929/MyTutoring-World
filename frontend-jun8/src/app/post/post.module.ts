import { NgModule, PipeTransform, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostRoutingModule } from './post.routing';

import { MediaModule } from '../media/media.module';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';

import { PostDetailComponent } from './components/detail/detail.component';

import { PostService } from '../shared/services/posts.service';
import { ButtonSignupComponent, ModalSignupComponent } from '../utils/components/modal-signup/modal-signup.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { QuillModule } from 'ngx-quill';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    PostRoutingModule,
    MediaModule,
    UserModule,
    UtilsModule,
    NgxSmartModalModule.forChild(),
    QuillModule,
    TranslateModule.forChild()
  ],
  declarations: [PostDetailComponent],
  providers: [PostService],
  exports: [],
  entryComponents: [ModalSignupComponent]
})
export class PostModule {}
