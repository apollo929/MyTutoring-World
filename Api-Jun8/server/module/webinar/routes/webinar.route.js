const controller = require('../controllers/webinar.controller');

module.exports = router => {
  /**
   * @apiDefine categoryRequest
   * @apiParam {String}   name        Category name
   * @apiParam {String}   [name]     Alias name. Or will be generated from name automatically
   * @apiParam {Number}   [maximumStrength]
   * @apiParam {String}   [categoryId]
   */

  router.get('/v1/webinars', Middleware.loadUser, controller.list, Middleware.Response.success('list'));

  router.get('/v1/webinars/:id', Middleware.loadUser, controller.findOne, Middleware.Response.success('webinar'));

  router.post('/v1/webinars', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));

  router.put('/v1/webinars/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));

  router.delete('/v1/webinars/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));

  // get user enrolled in webinar
  router.get('/v1/webinars/:webinarId/enrolled', Middleware.loadUser, controller.enrolledUsers, Middleware.Response.success('enrolled'));
  router.put(
    '/v1/webinar/:id/change-status',
    Middleware.isAuthenticated,
    controller.findOne,
    controller.changeStatus,
    Middleware.Response.success('changeStatus')
  );

  // get lastest slot
  router.get('/v1/webinars/:id/latest', controller.getLatestSlot, Middleware.Response.success('latest'));
};
