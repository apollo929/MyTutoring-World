const controller = require('../controllers/course.controller');

module.exports = router => {
  /**
   * @apiDefine categoryRequest
   * @apiParam {String}   name        Category name
   * @apiParam {String}   [name]     Alias name. Or will be generated from name automatically
   * @apiParam {Number}   [maximumStrength]
   * @apiParam {String}   [categoryId]
   */

  router.get('/v1/courses', Middleware.loadUser, controller.list, Middleware.Response.success('list'));

  router.get('/v1/courses/:id', Middleware.loadUser, controller.findOne, Middleware.Response.success('course'));

  router.post('/v1/courses', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));

  router.put('/v1/courses/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));

  router.delete('/v1/courses/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));

  router.get('/v1/my-course', Middleware.isAuthenticated, controller.myCourse, Middleware.Response.success('list'));
};
