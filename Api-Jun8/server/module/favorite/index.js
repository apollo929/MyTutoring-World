exports.model = {
  Favorite: require('./models/favorite')
};

exports.services = {
  FavoriteTutor: require('./services/FavoriteTutor'),
  FavoriteWebinar: require('./services/FavoriteWebinar'),
  FavoriteCourse: require('./services/FavoriteCourse')
};

exports.router = router => {
  require('./routes/favorite-tutor.route')(router);
  require('./routes/favorite-webinar.route')(router);
  require('./routes/favorite.route')(router);
};
