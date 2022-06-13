const statsController = require('./stats.controller');

module.exports = (router) => {
  router.get(
    '/v1/admin/stats',
    Middleware.hasRole('admin'),
    statsController.stats,
    Middleware.Response.success('stats')
  );
};
