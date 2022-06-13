exports.model = {
  Category: require('./models/category')
};

exports.router = (router) => {
  require('./routes/category.route')(router);
};
