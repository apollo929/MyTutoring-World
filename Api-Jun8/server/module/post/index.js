exports.model = {
  Post: require('./models/post'),
  PostCategory: require('./models/category')
};

exports.router = (router) => {
  require('./routes/category.route')(router);
  require('./routes/post.route')(router);
};
