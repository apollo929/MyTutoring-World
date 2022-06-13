exports.services = {
  Meeting: require('./services/Meeting')
};

exports.router = router => {
  require('./routes/meeting.route')(router);
};
