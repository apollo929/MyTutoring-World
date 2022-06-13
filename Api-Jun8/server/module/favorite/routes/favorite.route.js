const controller = require('../controllers/favorite.controller');

module.exports = router => {
  /**
   * @apiDefine favorite
   * @apiParam {String}   [userId]
   * @apiParam {String}   [webinarId]
   */

  router.get('/v1/favorites/:type', Middleware.isAuthenticated, controller.list, Middleware.Response.success('list'));

  router.get('/v1/favorites/:type/:id', Middleware.isAuthenticated, controller.findOne, Middleware.Response.success('favorite'));

  router.post('/v1/favorites/:type', Middleware.isAuthenticated, controller.favorite, Middleware.Response.success('favorite'));

  router.delete('/v1/favorites/:type/:id', Middleware.isAuthenticated, controller.unFavorite, Middleware.Response.success('unFavorite'));
};
