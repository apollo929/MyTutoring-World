exports.model = {
  Contact: require('./models/contact')
};

exports.router = (router) => {
  require('./routes/mail.route')(router);
  require('./routes/contact.route')(router);
};

exports.services = {
  Newsletter: require('./services/Newsletter')
};
