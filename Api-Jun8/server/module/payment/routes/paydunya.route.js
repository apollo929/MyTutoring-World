const paydunyaController = require('../controllers/paydunya.controller');

module.exports = (router) => {
  /**
   * @apiGroup Transaction
   * @apiVersion 1.0.0
   * @api {get} /v1/payment/paydunya/callback Paydunya callback
   * @apiPermission admin
   */
  router.get(
    '/v1/payment/paydunya/callback',
    Middleware.Request.log,
    paydunyaController.callback,
    Middleware.Response.success('callback')
  );

  router.post(
    '/v1/payment/paydunya/callback',
    Middleware.Request.log,
    paydunyaController.callback,
    Middleware.Response.success('callback')
  );
};
