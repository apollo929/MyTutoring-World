exports.model = {
  Testimonial: require('./models/testimonial')
};

exports.router = router => {
  require('./routes/testimonial.route')(router);
};
