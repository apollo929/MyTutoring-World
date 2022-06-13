const controller = require('../controllers/schedule.controller');

module.exports = router => {
  /**
   * @apiDefine categoryRequest
   * @apiParam {String}   name        Category name
   * @apiParam {String}   [name]     Alias name. Or will be generated from name automatically
   * @apiParam {Number}   [maximumStrength]
   * @apiParam {String}   [categoryId]
   */

  router.get('/v1/schedule', Middleware.loadUser, controller.list, Middleware.Response.success('list'));

  router.post('/v1/schedule', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));

  router.put('/v1/schedule/:slotId', Middleware.isAuthenticated, controller.update, Middleware.Response.success('update'));

  router.delete('/v1/schedule/:slotId', Middleware.isAuthenticated, controller.remove, Middleware.Response.success('remove'));

  router.delete('/v1/schedule/remove-by-hash/:hash', Middleware.isAuthenticated, controller.removeByHash, Middleware.Response.success('removeHash'));

  router.post('/v1/schedule/check-by-hash/:hash', Middleware.isAuthenticated, controller.checkByHash, Middleware.Response.success('checkHash'));

  router.post(
    '/v1/schedule/check-by-webinar/:webinarId',
    Middleware.isAuthenticated,
    controller.checkByWebinar,
    Middleware.Response.success('checkByWebinar')
  );
};
