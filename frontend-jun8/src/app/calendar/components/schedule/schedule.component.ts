// import { DTSService } from './../../../shared/services/dts.service';
// import { IUser } from './../../../user/interface';
// import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import * as _ from 'lodash';
// import * as moment from 'moment';
// import Tooltip from 'tooltip.js';
// // import { CalendarComponent } from 'ng-fullcalendar'
// import { CalendarService } from '../../services/calendar.service';

// import { AppointmentService } from '../../../appointment/services/appointment.service';
// import { AuthService } from '../../../shared/services';
// import {
//   CalendarOptions,
//   EventClickArg,
//   EventApi,
//   CalendarApi,
//   FullCalendarComponent,
//   EventInput
// } from '@fullcalendar/angular';
// import { TranslateService } from '@ngx-translate/core';
// @Component({
//   selector: 'app-schedule-calendar',
//   templateUrl: './schedule.html'
// })
// export class ScheduleEditComponent implements OnInit {
//   @Input() webinarId: any;
//   @Input() type: string;
//   @Input() hashWebinar: string;
//   @Input() isFree: boolean = false;
//   @Input() webinarName: string;
//   @Output() onChange = new EventEmitter();
//   public today = moment();
//   public getMonth = moment().get('month');
//   public month = moment().set('month', this.getMonth);
//   public day: any;
//   public date: any = [];
//   public i: any;
//   public showTime: any;
//   public startTime: any;
//   public toTime: any;
//   public events: any = [];
//   public currentUser: IUser;
//   public tutorTimeZone: string = '';
//   public calendarEvents: EventInput[] = [];
//   public calendarVisible = true;
//   public appointments: any[];
//   public calendarOptions: CalendarOptions = {
//     editable: true,
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'timeGridWeek,timeGridDay'
//     },
//     initialEvents: [],
//     selectable: true,
//     initialView: 'timeGridWeek',
//     eventOverlap: false,
//     locale: 'en',
//     select: this.select.bind(this),
//     eventClick: this.eventClick.bind(this),
//     eventDidMount: function (info) {
//       const item = info.event.extendedProps.item;
//       if (item.webinarName && item.webinarName.length > 0) {
//         const tooltip = new Tooltip(info.el, {
//           title: info.event.extendedProps.item.webinarName,
//           placement: 'top',
//           trigger: 'hover',
//           container: 'body'
//         });
//       }
//     },

//     eventsSet: this.handleEvents.bind(this),
//     eventDrop: this.updateEvent.bind(this),
//     datesSet: this.loadInitialEvents.bind(this),
//     eventResize: this.updateEvent.bind(this),
//     eventAllow: this.dragAllow.bind(this),
//     longPressDelay: 100,
//     eventLongPressDelay: 100,
//     selectLongPressDelay: 100
//   };
//   public currentEvents: EventApi[] = [];
//   public calendarApi: CalendarApi;
//   public initialized = false;

//   public webinarColors: any = {
//     active: '#e4465a',
//     otherClass: '#2596be',
//     soloClass: '#49be25'
//   };

//   public soloColors: any = {
//     active: '#e4465a',
//     groupClass: '#2596be',
//     otherType: '#49be25'
//   };

//   @ViewChild('calendar') calendarComponent: FullCalendarComponent;

//   constructor(
//     private calendar: CalendarService,
//     private toasty: ToastrService,
//     private authService: AuthService,
//     private appointmentServie: AppointmentService,
//     private translate: TranslateService,
//     private dts: DTSService
//   ) {}

//   ngOnInit() {}

//   handleEvents(events: EventApi[]) {
//     this.currentEvents = events;
//   }

//   dragAllow(dropInfo, _) {
//     const startTime = new Date(dropInfo.start);
//     const toTime = new Date(dropInfo.end);
//     const duration = moment.duration((moment(toTime).unix() - moment(startTime).unix()) * 1000);
//     if ((duration.minutes() > 0 && duration.hours() === 1) || duration.hours() > 1) {
//       this.toasty.error(this.translate.instant('Maximum time allowed is 1 hour!'));
//       return false;
//     }
//     if (moment().isAfter(startTime)) {
//       this.toasty.error(this.translate.instant('Cannot update slot in the past!'));
//       return false;
//     }
//     return true;
//   }

//   reRender() {
//     this.calendarComponent.getApi().render();
//   }

//   clearEvents() {
//     this.events = [];
//   }

//   loadStatic() {
//     this.calendarEvents = [];
//     this.calendarApi.removeAllEvents();
//     this.authService.getCurrentUser().then(user => {
//       if (user && user.id) {
//         this.tutorTimeZone = user.timezone;
//         this.calendar
//           .search({
//             startTime: moment(this.calendarApi.view.activeStart).toDate().toISOString(),
//             toTime: moment(this.calendarApi.view.activeEnd).toDate().toISOString(),
//             webinarId: this.webinarId || '',
//             take: 10000,
//             type: !this.type || this.type === 'subject' ? '' : 'webinar',
//             tutorId: user.id,
//             hashWebinar: this.hashWebinar || ''
//           })
//           .then(async resp => {
//             this.events = resp.data.items;
//             this.mappingData(this.events);
//             this.calendarApi.addEventSource(this.calendarEvents);
//           });
//       }
//     });
//   }

//   loadInitialEvents($event: CalendarApi) {
//     this.calendarEvents = [];
//     const calendarApi = $event.view.calendar;
//     this.calendarApi = calendarApi;
//     calendarApi.removeAllEvents();
//     this.authService.getCurrentUser().then(async user => {
//       this.tutorTimeZone = user.timezone;
//       if (user && user.id) {
//         if (!this.type || this.type === 'subject') {
//           await Promise.all([
//             this.appointmentServie
//               .appointmentTutor(user._id, {
//                 startTime: moment($event.view.activeStart).toDate().toISOString(),
//                 toTime: moment($event.view.activeEnd).toDate().toISOString()
//                 // targetType: 'subject'
//               })
//               .then(resp => {
//                 this.appointments = resp.data.items;
//                 return this.appointments;
//               }),
//             this.calendar
//               .search({
//                 tutorId: user._id,
//                 startTime: moment($event.view.activeStart).toDate().toISOString(),
//                 toTime: moment($event.view.activeEnd).toDate().toISOString(),
//                 take: 10000
//                 // type: 'subject'
//               })
//               .then(resp => {
//                 this.events = resp.data.items;
//                 return this.events;
//               })
//           ]);

//           this.mappingData(this.events);
//           calendarApi.addEventSource(this.calendarEvents);
//         } else {
//           this.calendar
//             .search({
//               startTime: moment($event.view.activeStart).toDate().toISOString(),
//               toTime: moment($event.view.activeEnd).toDate().toISOString(),
//               // webinarId: this.webinarId || '',
//               take: 10000,
//               // type: this.type || 'subject',
//               // type: !this.type || this.type === 'subject' ? '' : 'webinar',
//               tutorId: user.id
//               // hashWebinar: this.hashWebinar || ''
//             })
//             .then(async resp => {
//               this.events = resp.data.items;
//               this.events.forEach(e => {
//                 let soloClass = false;
//                 let otherClass = false;
//                 if (e.type === 'subject') soloClass = true;
//                 else {
//                   if (
//                     (this.webinarId && e.webinarId === this.webinarId) ||
//                     (this.hashWebinar && e.hashWebinar === this.hashWebinar)
//                   ) {
//                     otherClass = false;
//                   } else {
//                     otherClass = true;
//                   }
//                 }
//                 const calendarevent = {
//                   start: moment(e.startTime).toDate(),
//                   end: moment(e.toTime).toDate(),
//                   item: e,
//                   backgroundColor:
//                     !otherClass && !soloClass
//                       ? this.webinarColors.active
//                       : otherClass
//                       ? this.webinarColors.otherClass
//                       : this.webinarColors.soloClass,
//                   title: otherClass ? 'Other group class' : soloClass ? '1 on 1 class' : '',
//                   isDisabled: otherClass || soloClass ? true : false
//                 };
//                 this.calendarEvents.push(calendarevent);
//                 if (moment().utc().isAfter(moment.utc(calendarevent.start))) {
//                   calendarevent.backgroundColor = '#ddd';
//                 }
//               });
//               calendarApi.addEventSource(this.calendarEvents);
//             });
//         }
//       }
//     });
//   }

//   mappingData(items: any) {
//     if (items.length !== 0) {
//       items.map(item => {
//         this.createChunks(item);
//       });
//     }
//   }

//   eventClick($event: EventClickArg) {
//     const { isDisabled } = $event.event.extendedProps;
//     if (isDisabled) {
//       return;
//     }
//     if (window.confirm(this.translate.instant('Do you want to delete event?'))) {
//       const item = $event.event.extendedProps.item;
//       this.calendar
//         .delete(item.id)
//         .then(() => {
//           $event.event.remove();
//           this.toasty.success(this.translate.instant('Deleted'));
//           this.onChange.emit(this.isFree);
//         })
//         .catch(e =>
//           this.toasty.error(this.translate.instant(e.data.data.message || 'Something went wrong, please try again'))
//         );
//     }
//   }

//   updateEvent($event: any) {
//     const { isDisabled } = $event.event.extendedProps;
//     // console.log($event);
//     if (isDisabled) {
//       const oldEvent = {
//         start: $event.oldEvent.start,
//         end: $event.oldEvent.end,
//         item: $event.oldEvent.extendedProps.item,
//         backgroundColor: $event.oldEvent.backgroundColor,
//         title: $event.oldEvent.title
//       };

//       const calendarApi = $event.view.calendar;
//       const item = $event.event.extendedProps.item;
//       for (let index = 0; index < this.calendarEvents.length; index++) {
//         if (this.calendarEvents[index].item._id === item._id) {
//           this.calendarEvents[index] = oldEvent;
//         }
//       }
//       calendarApi.removeAllEvents();
//       calendarApi.addEventSource(this.calendarEvents);
//       return this.toasty.error(this.translate.instant('Cannot update this slot!'));
//     } else {
//       const oldEvent = {
//         start: $event.oldEvent.start,
//         end: $event.oldEvent.end,
//         item: $event.oldEvent.extendedProps.item
//       };

//       const calendarApi = $event.view.calendar;
//       const item = $event.event.extendedProps.item;
//       const dtsStartTime = moment($event.event.start).toDate();
//       if (moment().isAfter(dtsStartTime)) {
//         return this.toasty.error(this.translate.instant('Cannot update slot in the past!'));
//       }
//       let dtsToTime = moment($event.event.end).toDate();

//       // -- Handle daylight time saving --
//       let isDST = this.dts.isDTS(moment($event.event.start).toDate(), localStorage.getItem('timeZone'));
//       let startTime = dtsStartTime;
//       let toTime = dtsToTime;
//       if (isDST) {
//         startTime = moment($event.event.start).subtract(1, 'hour').toDate();
//         toTime = moment($event.event.end).subtract(1, 'hour').toDate();
//       }
//       this.calendar
//         .update(item._id, {
//           startTime,
//           toTime,
//           dtsToTime,
//           dtsStartTime,
//           webinarId: this.webinarId,
//           type: this.type || 'subject',
//           hashWebinar: this.hashWebinar || '',
//           isDST
//         })
//         .then(resp => {
//           const el = {
//             start: dtsStartTime,
//             end: dtsToTime,
//             item
//           };
//           for (let index = 0; index < this.calendarEvents.length; index++) {
//             if (this.calendarEvents[index].item._id === item._id) {
//               this.calendarEvents[index] = el;
//             }
//           }
//           this.toasty.success(this.translate.instant('Updated'));
//           this.onChange.emit(this.isFree);
//         })
//         .catch(e => {
//           for (let index = 0; index < this.calendarEvents.length; index++) {
//             if (this.calendarEvents[index].item._id === item._id) {
//               this.calendarEvents[index] = oldEvent;
//             }
//           }
//           calendarApi.removeAllEvents();
//           calendarApi.addEventSource(this.calendarEvents);
//           this.toasty.error(this.translate.instant(e.data ? e.data.message : e.message));
//           // this.toasty.error(this.translate.instant((e.data && e.data.data && e.data.data.message) || e.data.message);
//         });
//     }
//   }

//   select($event: any) {
//     console.log("this is click event");
//     const dtsStartTime = moment($event.start).toDate();
//     const calendarApi = $event.view.calendar;
//     this.calendarApi = calendarApi;

//     if (moment().isAfter(dtsStartTime)) {
//       return this.toasty.error(this.translate.instant('Cannot create slot in the past!'));
//     }
//     let dtsToTime = moment($event.end).toDate();
//     const duration = moment.duration((moment(dtsToTime).unix() - moment(dtsStartTime).unix()) * 1000);
//     // if (duration.minutes() > 30 || duration.hours() > 0) {
//     //   return this.toasty.error(this.translate.instant('Maximum time allowed is 30 minutes!'));
//     // }
//     if ((duration.minutes() > 0 && duration.hours() === 1) || duration.hours() > 1) {
//       return this.toasty.error(this.translate.instant('Maximum time allowed is 1 hour!'));
//     }
//     let isDST = this.dts.isDTS(moment($event.start).toDate(), localStorage.getItem('timeZone'));
//     let startTime = dtsStartTime;
//     let toTime = dtsToTime;
//     if (isDST) {
//       startTime = moment($event.start).subtract(1, 'hour').toDate();
//       toTime = moment($event.end).subtract(1, 'hour').toDate();
//     }

//     this.calendar
//       .create({
//         startTime,
//         toTime,
//         dtsToTime,
//         dtsStartTime,
//         webinarId: this.webinarId || '',
//         type: this.type || 'subject',
//         hashWebinar: this.hashWebinar || '',
//         isFree: this.isFree,
//         isDST
//       })
//       .then(resp => {
//         calendarApi.addEvent({
//           item: this.webinarName ? Object.assign(resp.data, { webinarName: this.webinarName }) : resp.data,
//           start: dtsStartTime,
//           end: dtsToTime,
//           backgroundColor: '#e4465a'
//         });
//         this.calendarEvents.push({
//           item: this.webinarName ? Object.assign(resp.data, { webinarName: this.webinarName }) : resp.data,
//           start: dtsStartTime,
//           end: dtsToTime
//         });
//         this.toasty.success(this.translate.instant('Created successfully'));
//         this.onChange.emit(this.isFree);
//         // this.ucCalendar.fullCalendar('renderEvent', el);
//         // this.ucCalendar.fullCalendar('rerenderEvents');
//       })
//       .catch(e =>
//         this.toasty.error(
//           this.translate.instant(e.data && e.data.data && e.data.data.message ? e.data.data.message : e.data.message)
//         )
//       );
//   }

//   createChunks(item: any) {
//     let startTime = moment(item.startTime).toDate();
//     let toTime = moment(item.toTime).toDate();
//     let isDST = false;
//     if (this.dts.isDTS(startTime, this.tutorTimeZone)) {
//       isDST = true;
//       startTime = this.dts.formatToDST(item.startTime).toDate();
//       toTime = this.dts.formatToDST(item.toTime).toDate();
//     }
//     do {
//       // const toTime = moment.utc(item.dtsToTime).toDate();
//       const slot = {
//         type: item.type,
//         start: startTime,
//         end: toTime,
//         backgroundColor: '#e4465a',
//         item,
//         isDisabled: false,
//         title: '',
//         isFree: item.isFree
//       };
//       if (slot.type === 'subject' && moment().utc().add(30, 'minute').isAfter(moment.utc(slot.start))) {
//         slot.backgroundColor = '#ddd';
//         slot.isDisabled = true;
//         slot.title = 'Not available';
//       }

//       if (slot.type === 'subject' && slot.isFree !== this.isFree) {
//         if (moment().utc().add(30, 'minute').isAfter(moment.utc(slot.start))) slot.backgroundColor = '#ddd';
//         else slot.backgroundColor = this.soloColors.otherType;
//         slot.isDisabled = true;
//         slot.title = slot.isFree ? 'Free slot' : 'Paid slot';
//       }

//       if (slot.type === 'subject' && item.booked) {
//         slot.backgroundColor = '#ddd';
//         slot.isDisabled = true;

//         slot.title = item.isFree ? 'Free slot - Booked' : 'Paid slot - Booked';
//       }
//       if (slot.type === 'webinar') {
//         if (moment().utc().add(30, 'minute').isAfter(moment.utc(slot.start))) slot.backgroundColor = '#ddd';
//         else slot.backgroundColor = this.soloColors.groupClass;
//         slot.isDisabled = true;

//         slot.title = 'Group class';
//       }

//       this.calendarEvents.push(slot);
//       startTime = toTime;
//     } while (moment(startTime).isBefore(item.toTime));
//     return this.calendarEvents;
//   }
// }

import { DTSService } from './../../../shared/services/dts.service';
import { IUser } from './../../../user/interface';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';
import Tooltip from 'tooltip.js';
// import { CalendarComponent } from 'ng-fullcalendar'
import { CalendarService } from '../../services/calendar.service';

import { AppointmentService } from '../../../appointment/services/appointment.service';
import { AuthService } from '../../../shared/services';
import {
  CalendarOptions,
  EventClickArg,
  EventApi,
  CalendarApi,
  FullCalendarComponent,
  EventInput
} from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule.html'
})
export class ScheduleEditComponent implements OnInit {
  @Input() webinarId: any;
  @Input() type: string;
  @Input() hashWebinar: string;
  @Input() isFree: boolean = false;
  @Input() webinarName: string;
  @Output() onChange = new EventEmitter();
  public today = moment();
  public getMonth = moment().get('month');
  public month = moment().set('month', this.getMonth);
  public day: any;
  public date: any = [];
  public i: any;
  public showTime: any;
  public startTime: any;
  public toTime: any;
  public events: any = [];
  public currentUser: IUser;
  public tutorTimeZone: string = '';
  public calendarEvents: EventInput[] = [];
  public calendarVisible = true;
  public appointments: any[];
  public calendarOptions: CalendarOptions = {
    editable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    initialEvents: [],
    selectable: true,
    initialView: 'timeGridWeek',
    eventOverlap: false,
    locale: 'en',
    select: this.select.bind(this),
    eventClick: this.eventClick.bind(this),
    eventDidMount: function (info) {
      const item = info.event.extendedProps.item;
      if (item.webinarName && item.webinarName.length > 0) {
        const tooltip = new Tooltip(info.el, {
          title: info.event.extendedProps.item.webinarName,
          placement: 'top',
          trigger: 'hover',
          container: 'body'
        });
      }
    },

    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.updateEvent.bind(this),
    datesSet: this.loadInitialEvents.bind(this),
    eventResize: this.updateEvent.bind(this),
    eventAllow: this.dragAllow.bind(this),
    longPressDelay: 100,
    eventLongPressDelay: 100,
    selectLongPressDelay: 100
  };
  public currentEvents: EventApi[] = [];
  public calendarApi: CalendarApi;
  public initialized = false;

  public webinarColors: any = {
    active: '#e4465a',
    otherClass: '#2596be',
    soloClass: '#49be25'
  };

  public soloColors: any = {
    active: '#e4465a',
    groupClass: '#2596be',
    otherType: '#49be25'
  };

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  constructor(
    private calendar: CalendarService,
    private toasty: ToastrService,
    private authService: AuthService,
    private appointmentServie: AppointmentService,
    private translate: TranslateService,
    private dts: DTSService
  ) {}

  ngOnInit() {}

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  dragAllow(dropInfo, _) {
    const startTime = new Date(dropInfo.start);
    const toTime = new Date(dropInfo.end);
    const duration = moment.duration((moment(toTime).unix() - moment(startTime).unix()) * 1000);
    if ((duration.minutes() > 0 && duration.hours() === 1) || duration.hours() > 1) {
      this.toasty.error(this.translate.instant('Maximum time allowed is 1 hour!'));
      return false;
    }
    if (moment().isAfter(startTime)) {
      this.toasty.error(this.translate.instant('Cannot update slot in the past!'));
      return false;
    }
    return true;
  }

  reRender() {
    this.calendarComponent.getApi().render();
  }

  clearEvents() {
    this.events = [];
  }

  loadStatic() {
    this.calendarEvents = [];
    this.calendarApi.removeAllEvents();
    this.authService.getCurrentUser().then(user => {
      if (user && user.id) {
        this.tutorTimeZone = user.timezone;
        this.calendar
          .search({
            startTime: moment(this.calendarApi.view.activeStart).toDate().toISOString(),
            toTime: moment(this.calendarApi.view.activeEnd).toDate().toISOString(),
            webinarId: this.webinarId || '',
            take: 10000,
            type: !this.type || this.type === 'subject' ? '' : 'webinar',
            tutorId: user.id,
            hashWebinar: this.hashWebinar || ''
          })
          .then(async resp => {
            this.events = resp.data.items;
            this.mappingData(this.events);
            this.calendarApi.addEventSource(this.calendarEvents);
          });
      }
    });
  }

  loadInitialEvents($event: CalendarApi) {
    this.calendarEvents = [];
    const calendarApi = $event.view.calendar;
    this.calendarApi = calendarApi;
    calendarApi.removeAllEvents();
    this.authService.getCurrentUser().then(async user => {
      this.tutorTimeZone = user.timezone;
      if (user && user.id) {
        if (!this.type || this.type === 'subject') {
          await Promise.all([
            this.appointmentServie
              .appointmentTutor(user._id, {
                startTime: moment($event.view.activeStart).toDate().toISOString(),
                toTime: moment($event.view.activeEnd).toDate().toISOString()
                // targetType: 'subject'
              })
              .then(resp => {
                this.appointments = resp.data.items;
                return this.appointments;
              }),
            this.calendar
              .search({
                tutorId: user._id,
                startTime: moment($event.view.activeStart).toDate().toISOString(),
                toTime: moment($event.view.activeEnd).toDate().toISOString(),
                take: 10000
                // type: 'subject'
              })
              .then(resp => {
                this.events = resp.data.items;
                return this.events;
              })
          ]);

          this.mappingData(this.events);
          calendarApi.addEventSource(this.calendarEvents);
        } else {
          this.calendar
            .search({
              startTime: moment($event.view.activeStart).toDate().toISOString(),
              toTime: moment($event.view.activeEnd).toDate().toISOString(),
              // webinarId: this.webinarId || '',
              take: 10000,
              // type: this.type || 'subject',
              // type: !this.type || this.type === 'subject' ? '' : 'webinar',
              tutorId: user.id
              // hashWebinar: this.hashWebinar || ''
            })
            .then(async resp => {
              this.events = resp.data.items;
              this.events.forEach(e => {
                let soloClass = false;
                let otherClass = false;
                if (e.type === 'subject') soloClass = true;
                else {
                  if (
                    (this.webinarId && e.webinarId === this.webinarId) ||
                    (this.hashWebinar && e.hashWebinar === this.hashWebinar)
                  ) {
                    otherClass = false;
                  } else {
                    otherClass = true;
                  }
                }
                const calendarevent = {
                  start: moment(e.startTime).toDate(),
                  end: moment(e.toTime).toDate(),
                  item: e,
                  backgroundColor:
                    !otherClass && !soloClass
                      ? this.webinarColors.active
                      : otherClass
                      ? this.webinarColors.otherClass
                      : this.webinarColors.soloClass,
                  title: otherClass ? 'Other group class' : soloClass ? '1 on 1 class' : '',
                  isDisabled: otherClass || soloClass ? true : false
                };
                this.calendarEvents.push(calendarevent);
                if (moment().utc().isAfter(moment.utc(calendarevent.start))) {
                  calendarevent.backgroundColor = '#ddd';
                }
              });
              calendarApi.addEventSource(this.calendarEvents);
            });
        }
      }
    });
  }

  mappingData(items: any) {
    if (items.length !== 0) {
      items.map(item => {
        this.createChunks(item);
      });
    }
  }

  eventClick($event: EventClickArg) {
    const { isDisabled } = $event.event.extendedProps;
    if (isDisabled) {
      return;
    }
    if (window.confirm(this.translate.instant('Do you want to delete event?'))) {
      const item = $event.event.extendedProps.item;
      this.calendar
        .delete(item.id)
        .then(() => {
          $event.event.remove();
          this.toasty.success(this.translate.instant('Deleted'));
          this.onChange.emit(this.isFree);
        })
        .catch(e =>
          this.toasty.error(this.translate.instant(e.data.data.message || 'Something went wrong, please try again'))
        );
    }
  }

  updateEvent($event: any) {
    const { isDisabled } = $event.event.extendedProps;
    // console.log($event);
    if (isDisabled) {
      const oldEvent = {
        start: $event.oldEvent.start,
        end: $event.oldEvent.end,
        item: $event.oldEvent.extendedProps.item,
        backgroundColor: $event.oldEvent.backgroundColor,
        title: $event.oldEvent.title
      };

      const calendarApi = $event.view.calendar;
      const item = $event.event.extendedProps.item;
      for (let index = 0; index < this.calendarEvents.length; index++) {
        if (this.calendarEvents[index].item._id === item._id) {
          this.calendarEvents[index] = oldEvent;
        }
      }
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(this.calendarEvents);
      return this.toasty.error(this.translate.instant('Cannot update this slot!'));
    } else {
      const oldEvent = {
        start: $event.oldEvent.start,
        end: $event.oldEvent.end,
        item: $event.oldEvent.extendedProps.item
      };

      const calendarApi = $event.view.calendar;
      const item = $event.event.extendedProps.item;
      const dtsStartTime = moment($event.event.start).toDate();
      if (moment().isAfter(dtsStartTime)) {
        return this.toasty.error(this.translate.instant('Cannot update slot in the past!'));
      }
      let dtsToTime = moment($event.event.end).toDate();

      // -- Handle daylight time saving --
      let isDST = this.dts.isDTS(moment($event.event.start).toDate(), localStorage.getItem('timeZone'));
      let startTime = dtsStartTime;
      let toTime = dtsToTime;
      if (isDST) {
        startTime = moment($event.event.start).subtract(1, 'hour').toDate();
        toTime = moment($event.event.end).subtract(1, 'hour').toDate();
      }
      this.calendar
        .update(item._id, {
          startTime,
          toTime,
          dtsToTime,
          dtsStartTime,
          webinarId: this.webinarId,
          type: this.type || 'subject',
          hashWebinar: this.hashWebinar || '',
          isDST
        })
        .then(resp => {
          const el = {
            start: dtsStartTime,
            end: dtsToTime,
            item
          };
          for (let index = 0; index < this.calendarEvents.length; index++) {
            if (this.calendarEvents[index].item._id === item._id) {
              this.calendarEvents[index] = el;
            }
          }
          this.toasty.success(this.translate.instant('Updated'));
          this.onChange.emit(this.isFree);
        })
        .catch(e => {
          for (let index = 0; index < this.calendarEvents.length; index++) {
            if (this.calendarEvents[index].item._id === item._id) {
              this.calendarEvents[index] = oldEvent;
            }
          }
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(this.calendarEvents);
          this.toasty.error(this.translate.instant(e.data ? e.data.message : e.message));
          // this.toasty.error(this.translate.instant((e.data && e.data.data && e.data.data.message) || e.data.message);
        });
    }
  }

  select($event: any) {
    console.log($event);
    const dtsStartTime = moment($event.start).toDate();
    const calendarApi = $event.view.calendar;
    this.calendarApi = calendarApi;

    if (moment().isAfter(dtsStartTime)) {
      return this.toasty.error(this.translate.instant('Cannot create slot in the past!'));
    }
    let dtsToTime = moment($event.end).toDate();
    console.log(this.isFree);
    if(!this.isFree){
      if(dtsToTime.getMinutes() == 30){
        dtsToTime.setMinutes(dtsToTime.getMinutes() + 30);
      }
      else{
        dtsStartTime.setMinutes(dtsStartTime.getMinutes() - 30);
      }
    }

    const duration = moment.duration((moment(dtsToTime).unix() - moment(dtsStartTime).unix()) * 1000);
    // if (duration.minutes() > 30 || duration.hours() > 0) {
    //   return this.toasty.error(this.translate.instant('Maximum time allowed is 30 minutes!'));
    // }
    if ((duration.minutes() > 0 && duration.hours() === 1) || duration.hours() > 1) {
      return this.toasty.error(this.translate.instant('Maximum time allowed is 1 hour!'));
    }
    let isDST = this.dts.isDTS(moment($event.start).toDate(), localStorage.getItem('timeZone'));
    let startTime = dtsStartTime;
    let toTime = dtsToTime;
    if (isDST) {
      startTime = moment($event.start).subtract(1, 'hour').toDate();
      toTime = moment($event.end).subtract(1, 'hour').toDate();
      if(!this.isFree)
        if(startTime.getMinutes() == 30){
          toTime.setMinutes(toTime.getMinutes() + 30);
        }
        else{
          startTime.setMinutes(startTime.getMinutes() - 30);
        }
    }

    this.calendar
      .create({
        startTime,
        toTime,
        dtsToTime,
        dtsStartTime,
        webinarId: this.webinarId || '',
        type: this.type || 'subject',
        hashWebinar: this.hashWebinar || '',
        isFree: this.isFree,
        isDST
      })
      .then(resp => {
        calendarApi.addEvent({
          item: this.webinarName ? Object.assign(resp.data, { webinarName: this.webinarName }) : resp.data,
          start: dtsStartTime,
          end: dtsToTime,
          backgroundColor: '#e4465a'
        });
        this.calendarEvents.push({
          item: this.webinarName ? Object.assign(resp.data, { webinarName: this.webinarName }) : resp.data,
          start: dtsStartTime,
          end: dtsToTime
        });
        this.toasty.success(this.translate.instant('Created successfully'));
        this.onChange.emit(this.isFree);
        // this.ucCalendar.fullCalendar('renderEvent', el);
        // this.ucCalendar.fullCalendar('rerenderEvents');
      })
      .catch(e =>
        this.toasty.error(
          this.translate.instant(e.data && e.data.data && e.data.data.message ? e.data.data.message : e.data.message)
        )
      );
  }

  createChunks(item: any) {
    let startTime = moment(item.startTime).toDate();
    let toTime = moment(item.toTime).toDate();
    let isDST = false;
    if (this.dts.isDTS(startTime, this.tutorTimeZone)) {
      isDST = true;
      startTime = this.dts.formatToDST(item.startTime).toDate();
      toTime = this.dts.formatToDST(item.toTime).toDate();
    }
    do {
      // const toTime = moment.utc(item.dtsToTime).toDate();
      const slot = {
        type: item.type,
        start: startTime,
        end: toTime,
        backgroundColor: '#e4465a',
        item,
        isDisabled: false,
        title: '',
        isFree: item.isFree
      };
      if (slot.type === 'subject' && moment().utc().add(30, 'minute').isAfter(moment.utc(slot.start))) {
        slot.backgroundColor = '#ddd';
        slot.isDisabled = true;
        slot.title = 'Not available';
      }

      if (slot.type === 'subject' && slot.isFree !== this.isFree) {
        if (moment().utc().add(30, 'minute').isAfter(moment.utc(slot.start))) slot.backgroundColor = '#ddd';
        else slot.backgroundColor = this.soloColors.otherType;
        slot.isDisabled = true;
        slot.title = slot.isFree ? 'Free slot' : 'Paid slot';
      }

      if (slot.type === 'subject' && item.booked) {
        slot.backgroundColor = '#ddd';
        slot.isDisabled = true;

        slot.title = item.isFree ? 'Free slot - Booked' : 'Paid slot - Booked';
      }
      if (slot.type === 'webinar') {
        if (moment().utc().add(30, 'minute').isAfter(moment.utc(slot.start))) slot.backgroundColor = '#ddd';
        else slot.backgroundColor = this.soloColors.groupClass;
        slot.isDisabled = true;

        slot.title = 'Group class';
      }

      this.calendarEvents.push(slot);
      startTime = toTime;
    } while (moment(startTime).isBefore(item.toTime));
    return this.calendarEvents;
  }
}
