exports.model = {
  AvailableTime: require('./models/available-time')
};

exports.services = {
  AvailableTime: require('./services/AvailableTime')
};

exports.router = (router) => {
  require('./routes/available-time.route')(router);
};
