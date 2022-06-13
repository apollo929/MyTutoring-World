exports.model = {
  RefundRequest: require('./models/refund-request')
};

exports.services = {
  RefundRequest: require('./services/RefundRequest')
};

exports.router = router => {
  require('./routes/refund.route')(router);
};
