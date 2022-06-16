import { NgModule, PipeTransform, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { PostRoutingModule } from './post.routing';

import { MediaModule } from '../media/media.module';
import { UserModule } from '../user/user.module';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { EllipsisPipe } from './ellipsis.pipe';

import { PostListComponent, PostUpdateComponent, PostCreateComponent } from './components';

import { PostService } from './services/post.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    PostRoutingModule,
    MediaModule,
    UserModule,
    FroalaEditorModule,
    QuillModule.forRoot()
  ],
  declarations: [PostListComponent, PostUpdateComponent, PostCreateComponent, EllipsisPipe],
  providers: [PostService],
  exports: [],
  entryComponents: []
})
export class PostModule {}
