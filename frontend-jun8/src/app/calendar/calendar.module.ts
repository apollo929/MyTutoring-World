import { DTSService } from './../shared/services/dts.service';
import { AppointmentService } from './../appointment/services/appointment.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from './services/calendar.service';
import { UtilsModule } from '../utils/utils.module';
import { ScheduleEditComponent, UserAvailableTimeComponent } from './components';
import { TranslateModule } from '@ngx-translate/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]);
@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, UtilsModule, TranslateModule.forChild(), FullCalendarModule],
  declarations: [ScheduleEditComponent, UserAvailableTimeComponent],
  providers: [CalendarService, AppointmentService, DTSService],
  exports: [ScheduleEditComponent, UserAvailableTimeComponent],
  entryComponents: []
})
export class CalendarModule {}
