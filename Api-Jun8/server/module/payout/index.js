exports.model = {
  PayoutRequest: require('./models/payout-request'),
  PayoutItem: require('./models/payout-item'),
  PayoutAccount: require('./models/payout-account')
};

exports.mongoosePlugin = require('./mongoosePlugin');

exports.services = {
  PayoutRequest: require('./services/PayoutRequest')
};

exports.router = router => {
  require('./routes/stats.route')(router);
  require('./routes/request.route')(router);
  require('./routes/account.route')(router);
};
