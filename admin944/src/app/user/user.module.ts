import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { UserRoutingModule } from './user.routing';
import { UserCreateComponent } from './create/create.component';
import { UserListingComponent } from './list/listing.component';
import { UserService } from './user.service';
import { UserUpdateComponent } from './update/update.component';
import { ProfileUpdateComponent } from './profile/profile-update.component';
import { MediaModule } from '../media/media.module';
import { TutorModule } from '../tutor/tutor.module';

@NgModule({
  imports: [CommonModule, FormsModule, UserRoutingModule, NgbModule, MediaModule, TutorModule, QuillModule.forRoot()],
  declarations: [UserCreateComponent, UserListingComponent, UserUpdateComponent, ProfileUpdateComponent],
  providers: [UserService],
  exports: []
})
export class UserModule {}
