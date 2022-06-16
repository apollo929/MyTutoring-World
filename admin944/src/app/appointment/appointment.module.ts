import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentRoutingModule } from './appointment.routing';
import { MediaModule } from '../media/media.module';
import { TutorModule } from '../tutor/tutor.module';

import {
  AppointmentListingComponent,
  AppointmentDetailComponent,
  CancelAppointmentComponent,
  NgbdModalComponent,
  AppointmentStatusComponent,
  AppointmentDateRangeComponent
} from './components';

import { AppointmentService } from './services/appointment.service';
import { TutorService } from '../tutor/tutor.service';
import { UserService } from '../user/user.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, AppointmentRoutingModule, MediaModule, TutorModule],
  declarations: [
    AppointmentListingComponent,
    CancelAppointmentComponent,
    NgbdModalComponent,
    AppointmentDetailComponent,
    AppointmentStatusComponent,
    AppointmentDateRangeComponent
  ],
  providers: [AppointmentService, TutorService, UserService],
  exports: [AppointmentStatusComponent, AppointmentDateRangeComponent],
  entryComponents: [CancelAppointmentComponent]
})
export class AppointmentModule {}
