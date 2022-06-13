const controller = require('../controllers/coupon.controller');

module.exports = router => {
  /**
   * @apiDefine coupon
   * @apiParam {String}   [name]
   * @apiParam {String}   [code]
   * @apiParam {String}   [type]
   * @apiParam {Number}   [value]
   * @apiParam {String}   [webinarId]
   * @apiParam {String}   [tutorId]
   * @apiParam {String}   [expiredDate]
   * @apiParam {Boolean}   [active]
   */

  router.get('/v1/coupons', Middleware.hasRole('admin'), controller.list, Middleware.Response.success('list'));

  router.get('/v1/coupons/:id', Middleware.isAuthenticated, controller.findOne, Middleware.Response.success('coupon'));

  router.post('/v1/coupons', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));

  router.put('/v1/coupons/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));

  router.delete('/v1/coupons/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));

  router.get(
    '/v1/coupons/check-used-coupon/:couponId',
    Middleware.isAuthenticated,
    controller.isUsedCoupon,
    Middleware.Response.success('isUsedCoupon')
  );

  router.get('/v1/coupon/apply-coupon', Middleware.isAuthenticated, controller.applyCoupon, Middleware.Response.success('apply'));

  router.get('/v1/coupon/current', Middleware.isAuthenticated, controller.getCurrentCoupon, Middleware.Response.success('current'));
};
