const controller = require('../controllers/goal.controller');

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

  router.get('/v1/goals', Middleware.hasRole('admin'), controller.list, Middleware.Response.success('list'));

  router.get('/v1/goals/:id', Middleware.isAuthenticated, controller.findOne, Middleware.Response.success('goals'));

  router.post('/v1/goals', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));

  router.put('/v1/goals/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));

  router.delete('/v1/goals/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));

  router.get('/v1/goal/current', Middleware.isAuthenticated, controller.getCurrentGoal, Middleware.Response.success('current'));
};
