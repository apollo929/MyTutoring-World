const requestController = require('../controllers/request.controller');

module.exports = router => {
  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Send request
   * @api {post} /v1/payout/request Send request
   * @apiParam {String}   payoutAccountId
   * @apiPermission tutor
   */
  router.post('/v1/payout/request', Middleware.isAuthenticated, requestController.request, Middleware.Response.success('request'));

  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Reject
   * @api {post} /v1/payout/request/:requestId/reject Reject request
   * @apiParam {String}   requestId
   * @apiParam {String}   rejectReason Reason why reject this request from admin
   * @apiParam {String}   [note] Custom any note to request
   * @apiPermission admin
   */
  router.post('/v1/payout/request/:requestId/reject', Middleware.hasRole('admin'), requestController.reject, Middleware.Response.success('reject'));

  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Approve
   * @api {post} /v1/payout/request/:requestId/approve Approve request
   * @apiParam {String}   requestId
   * @apiParam {String}   [note] Custom any note to request
   * @apiPermission admin
   */
  router.post(
    '/v1/payout/request/:requestId/approve',
    Middleware.hasRole('admin'),
    requestController.approve,
    Middleware.Response.success('approve')
  );

  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Get list
   * @api {get} /v1/payout/requests?:type&:tutorId&:status&:code Get list
   * @apiUse paginationQuery
   * @apiParam {String} [type] `paypal` or `bank-account`
   * @apiParam {String} [status] Allow empty, `approved` or `rejected`
   * @apiParam {String} [tutorId] The tutor, allow for admin account only
   * @apiParam {String} [code] search text for code
   * @apiPermission tutor
   */
  router.get('/v1/payout/requests', Middleware.isAuthenticated, requestController.list, Middleware.Response.success('list'));

  /**
   * @apiGroup Request_Payout
   * @apiVersion 1.0.0
   * @apiName Find one
   * @api {get} /v1/payout/requests/:requestId Find detail
   * @apiParam {String} requestId
   * @apiPermission tutor
   */
  router.get('/v1/payout/requests/:requestId', Middleware.isAuthenticated, requestController.findOne, Middleware.Response.success('payoutRequest'));
};
