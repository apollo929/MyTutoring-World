const controller = require('../controllers/favorite-tutor.controller');

module.exports = router => {
  /**
   * @apiDefine favorite
   * @apiParam {String}   [userId]
   * @apiParam {String}   [tutorId]
   */

  router.get('/v1/favorites-tutor', Middleware.isAuthenticated, controller.list, Middleware.Response.success('list'));

  router.get(
    '/v1/favorites-tutor/:id',
    Middleware.isAuthenticated,
    controller.findOne,
    Middleware.Response.success('favorite')
  );

  router.post(
    '/v1/favorites-tutor',
    Middleware.isAuthenticated,
    controller.favorite,
    Middleware.Response.success('favorite')
  );

  router.delete(
    '/v1/favorites-tutor/:id',
    Middleware.isAuthenticated,
    controller.unFavorite,
    Middleware.Response.success('unFavorite')
  );
};
