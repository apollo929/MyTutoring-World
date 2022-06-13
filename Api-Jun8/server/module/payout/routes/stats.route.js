const statsController = require('../controllers/stats.controller');

module.exports = router => {
  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Get balance
   * @apiDescription Get current balance of current tutor
   * @api {get} /v1/payout/balance
   * @apiPermission seller
   */
  router.get('/v1/payout/balance', Middleware.isAuthenticated, statsController.balance, Middleware.Response.success('balance'));

  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Get balance by tutor
   * @apiDescription Get current balance of tutor
   * @api {get} /v1/payout/balance/:tutorId
   * @apiPermission admin
   */
  router.get('/v1/payout/balance/:tutorId', Middleware.hasRole('admin'), statsController.balance, Middleware.Response.success('balance'));

  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Stats current tutor
   * @apiDescription Get statistic for the current tutor
   * @api {get} /v1/payout/stats?:tutorId&:startDate&:toDate
   * @apiParam {String} [tutorId] allow tutor if admin
   * @apiParam {Date} [startDate] UTC time format
   * @apiParam {Date} [toDate] UTC time format
   * @apiPermission seller
   */
  router.get('/v1/payout/stats', Middleware.isAuthenticated, statsController.stats, Middleware.Response.success('stats'));

  /**
   * @apiGroup Request_Payout Stats
   * @apiVersion 1.0.0
   * @apiName Get list
   * @api {get} /v1/payout/requests/stats
   * @apiUse paginationQuery
   * @apiPermission admin
   */
  router.get(
    '/v1/admin/payout/requests/stats',
    Middleware.hasRole('admin'),
    statsController.statsEarningTutor,
    Middleware.Response.success('statsEarningTutor')
  );

  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Find one
   * @api {get} /v1/admin/payout/requests/stat/:id Find detail
   * @apiParam {String} id
   * @apiPermission tutor
   */
  router.get(
    '/v1/admin/payout/requests/stats/:tutorId',
    Middleware.hasRole('admin'),
    statsController.statsEarningTutorDetail,
    Middleware.Response.success('statDetail')
  );

  router.get('/v1/admin/earnings/export/:type', Middleware.hasRole('admin'), statsController.exportEarnings);
};
