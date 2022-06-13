const controller = require('../controllers/favorite-webinar.controller');

module.exports = router => {
  /**
   * @apiDefine favorite
   * @apiParam {String}   [userId]
   * @apiParam {String}   [webinarId]
   */

  router.get('/v1/favorites-webinar', Middleware.isAuthenticated, controller.list, Middleware.Response.success('list'));

  router.get('/v1/favorites-webinar/:id', Middleware.isAuthenticated, controller.findOne, Middleware.Response.success('favorite'));

  router.post('/v1/favorites-webinar', Middleware.isAuthenticated, controller.favorite, Middleware.Response.success('favorite'));

  router.delete('/v1/favorites-webinar/:id', Middleware.isAuthenticated, controller.unFavorite, Middleware.Response.success('unFavorite'));
};
