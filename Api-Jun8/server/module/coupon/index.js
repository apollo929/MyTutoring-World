exports.model = {
  Coupon: require("./models/coupon"),
};

exports.services = {
  Coupon: require("./services/Coupon"),
};

exports.router = (router) => {
  require("./routes/coupon.route")(router);
};
