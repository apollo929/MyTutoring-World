exports.model = {
  Topic: require('./models/topic')
};

exports.router = router => {
  require('./routes/topic.route')(router);
};
