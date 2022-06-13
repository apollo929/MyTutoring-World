const controller = require('../controllers/lecture.controller');

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

  router.get('/v1/lectures', Middleware.hasRole('admin'), controller.list, Middleware.Response.success('list'));

  router.get('/v1/lectures/:id', Middleware.isAuthenticated, controller.findOne, Middleware.Response.success('lecture'));

  router.post('/v1/lectures', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));

  router.put('/v1/lectures/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));

  router.delete('/v1/lectures/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));

  router.get('/v1/lecture/current', Middleware.isAuthenticated, controller.getCurrentLecture, Middleware.Response.success('current'));
};
