exports.services = {
  ZoomUs: require('./services/ZoomUs')
};

exports.router = router => {
  require('./routes/zoomus.route')(router);
};
