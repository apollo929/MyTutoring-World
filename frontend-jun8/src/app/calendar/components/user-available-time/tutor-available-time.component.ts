import { DTSService } from './../../../shared/services/dts.service';
import { AuthService } from './../../../shared/services/auth.service';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, OnChanges, AfterViewInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { AppointmentService } from '../../../appointment/services/appointment.service';
import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import { CalendarOptions, EventClickArg, CalendarApi, FullCalendarComponent, EventInput } from '@fullcalendar/angular';
@Component({
  selector: 'app-tutor-available-time',
  templateUrl: 'tutor-available-time.html'
})
export class UserAvailableTimeComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() tutorId: any;
  @Input() timeSelected: any = {};
  @Input() isFree: boolean = false;
  @Output() onSelect = new EventEmitter();
  private startTime;
  private toTime;
  public weekText = '';
  public states: any = {
    active: ''
  };
  public userTimeZone: string = '';
  public appointments: any;
  public availableTimes: any;
  public calendarEvents: EventInput[] = [];
  public calendarVisible = true;
  public calendarOptions: CalendarOptions = {
    editable: false,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    initialEvents: [],
    selectable: true,
    initialView: 'timeGridWeek',
    eventOverlap: true,
    locale: 'en',
    // select: this.select.bind(this),
    eventClick: this.onSelectSlot.bind(this),
    eventDidMount: function (info) {
      const { item, isDisabled } = info.event.extendedProps;
      if (!isDisabled) {
        const element = info.el;
        element.querySelector('.fc-event-title').innerHTML =
          '<a class="book-now" style="color: white;" href="javascript:void(0)">' + 'Book now' + '</a>';
      }
    },
    datesSet: this.changeWeek.bind(this)
    //slotDuration: '00:15:00'
  };
  // public currentEvents: EventApi[] = [];
  public calendarApi: CalendarApi;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  constructor(
    private service: CalendarService,
    private appointmentServie: AppointmentService,
    private auth: AuthService,
    private dtsService: DTSService
  ) {}

  ngOnInit() {
    if (this.timeSelected && this.timeSelected.startTime) {
      this.select(this.timeSelected);
    }

    if (this.auth.isLoggedin()) {
      this.auth.getCurrentUser().then(user => (this.userTimeZone = user.timezone));
    }
  }

  async ngOnChanges() {
    if (this.startTime && this.toTime) {
      this.calendarEvents = [];
      this.calendarApi.removeAllEvents();
      await this.query();
      this.calendarApi.addEventSource(this.calendarEvents);
    }
  }

  ngAfterViewInit() {
    this.calendarApi = this.calendarComponent.getApi();
    // this.calendarApi.next();
  }

  async query() {
    await Promise.all([
      this.appointmentServie
        .appointmentTutor(this.tutorId, {
          startTime: this.startTime,
          toTime: this.toTime,
          targetType: 'subject',
          status: 'booked,pending',
          isFree: this.isFree
        })
        .then(resp => {
          this.appointments = resp.data.items;
          return this.appointments;
        }),
      this.service
        .search({
          tutorId: this.tutorId,
          startTime: this.startTime,
          toTime: this.toTime,
          take: 10000,
          type: 'subject',
          isFree: this.isFree
        })
        .then(resp => {
          this.availableTimes = resp.data.items;
          return this.availableTimes;
        })
    ]);
    this.mappingData(this.availableTimes);
  }

  mappingData(items: any) {
    if (items.length !== 0) {
      items.map(item => {
        this.createChunks(item);
      });
    }
  }

  createChunks(item: any) {
    let startTime = moment(item.startTime).toDate();
    let toTime = moment(item.toTime).toDate();
    let isDST = false;
    if (this.dtsService.isDTS(startTime, localStorage.getItem('timeZone'))) {
      isDST = true;
      startTime = this.dtsService.formatToDST(item.startTime).toDate();
      toTime = this.dtsService.formatToDST(item.toTime).toDate();
    }
    do {
      const slot = {
        start: startTime,
        end: toTime,
        backgroundColor: '#e4465a',
        item,
        isDisabled: false,
        title: '',
        isDST
      };
      if (moment().add(15, 'minute').isAfter(moment(slot.start))) {
        slot.backgroundColor = '#ddd';
        slot.isDisabled = true;
        slot.title = 'Not available';
      }
      this.appointments.forEach(appointment => {
        if (moment(appointment.startTime).format() === moment(item.startTime).format()) {
          slot.backgroundColor = '#ddd';
          slot.isDisabled = true;
          slot.title = 'Not available';
        }
      });
      this.calendarEvents.push(slot);
      startTime = toTime;
    } while (moment(startTime).isBefore(item.toTime));
    return this.calendarEvents;
  }

  select(time: any) {
    this.states.active = time.startTime;
    this.onSelect.emit(time);
  }

  async changeWeek($event: CalendarApi) {
    this.calendarEvents = [];
    const calendarApi = $event.view.calendar;
    calendarApi.removeAllEvents();
    this.startTime = moment($event.view.activeStart).toDate().toISOString();
    this.toTime = moment($event.view.activeEnd).toDate().toISOString();
    await this.query();
    calendarApi.addEventSource(this.calendarEvents);
  }

  onSelectSlot($event: EventClickArg) {
    const { item, isDisabled } = $event.event.extendedProps;
    if ($event.event.backgroundColor == "#0d3c18") {
      $event.event.setProp("backgroundColor", "#e4465a");
    } else {
      $event.event.setProp("backgroundColor", "#0d3c18");
    }
    if (isDisabled) {
      return;
    }
    this.onSelect.emit($event.event);
  }

  isDTS(date, timezone = '') {
    const isDTS = timezone ? momentTimeZone.tz(date, timezone).isDST() : moment(date).isDST();
    return isDTS;
  }
}
