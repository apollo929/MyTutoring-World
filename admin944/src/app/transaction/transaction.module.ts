import { NgModule, PipeTransform, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionRoutingModule } from './transaction.routing';

import { MediaModule } from '../media/media.module';
import { UserModule } from '../user/user.module';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { QuillModule } from 'ngx-quill';

import { TransactionDetailComponent, TransactionListComponent } from './components';
import { AppointmentModule } from '../appointment/appointment.module';
import { TutorService } from '../tutor/tutor.service';
import { UserService } from '../user/user.service';
import { TransactionService } from './services/transaction.service';
import { AppointmentService } from '../appointment/services/appointment.service';
import { TutorModule } from '../tutor/tutor.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TransactionRoutingModule,
    MediaModule,
    UserModule,
    FroalaEditorModule,
    TutorModule,
    AppointmentModule,
    QuillModule.forRoot()
  ],
  declarations: [TransactionListComponent, TransactionDetailComponent],
  providers: [TransactionService, AppointmentService, UserService, TutorService],
  exports: [],
  entryComponents: []
})
export class TransactionModule {}
