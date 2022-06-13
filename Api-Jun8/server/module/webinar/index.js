exports.model = {
  Schedule: require('./models/schedule'),
  Webinar: require('./models/webinar'),
  Gift: require('./models/gift')
};

exports.services = {
  Schedule: require('./services/Schedule'),
  Webinar: require('./services/Webinar')
};

exports.router = router => {
  require('./routes/webinar.route')(router);
  require('./routes/schedule.route')(router);
};

exports.agendaJobs = [
  {
    name: 'check-last-time',
    interval: '5 minutes',
    job: require('./agenda/check-last-time')
  },
  // {
  //   name: 'complete-schedule',
  //   interval: '15 minutes',
  //   job: require('./agenda/complete-schedule')
  // },
  {
    name: 'notify-schedule',
    interval: '5 minutes',
    job: require('./agenda/notify-schedule')
  },
  {
    name: 'notify-gift',
    interval: '5 minutes',
    job: require('./agenda/notify-gift')
  }
];
