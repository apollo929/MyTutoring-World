const refundController = require('../controllers/refund.controller');
module.exports = (router) => {
  /**
     * @apiGroup Refund_Request
     * @apiVersion 1.0.0
     * @apiName Send request
     * @api {post} /v1/refund/request Send request
     * @apiParam {String}   appointmentId
     * @apiPermission tutor
     */
  router.post(
    '/v1/refund/request',
    Middleware.isAuthenticated,
    refundController.request,
    Middleware.Response.success('request')
  );

  /**
   * @apiGroup Refund_Request
   * @apiVersion 1.0.0
   * @apiName Reject
   * @api {post} /v1/refund/request/:refundRequestId/reject Reject request
   * @apiParam {String}   refundRequestId
   * @apiParam {String}   rejectReason Reason why reject this request from admin
   * @apiParam {String}   [note] Custom any note to request
   * @apiPermission admin
   */
  router.post(
    '/v1/refund/request/:refundRequestId/reject',
    Middleware.hasRole('admin'),
    refundController.reject,
    Middleware.Response.success('reject')
  );

  /**
   * @apiGroup Refund_Request
   * @apiVersion 1.0.0
   * @apiName Approve
   * @api {post} /v1/refund/request/:refundRequestId/approve Approve request
   * @apiParam {String}   refundRequestId
   * @apiParam {String}   [note] Custom any note to request
   * @apiPermission admin
   */
  router.post(
    '/v1/refund/request/:refundRequestId/approve',
    Middleware.hasRole('admin'),
    refundController.approve,
    Middleware.Response.success('approve')
  );

  /**
   * @apiGroup Refund_Request
   * @apiVersion 1.0.0
   * @apiName Approve
   * @api {post} /v1/refund/request/:refundRequestId/confirm Confirm refund
   * @apiParam {String}   refundRequestId
   * @apiPermission admin
   */
  router.post(
    '/v1/refund/request/:refundRequestId/confirm',
    Middleware.hasRole('admin'),
    refundController.confirmRefunded,
    Middleware.Response.success('confirm')
  );

  /**
     * @apiGroup Refund_Request
     * @apiVersion 1.0.0
     * @apiName Get list
     * @api {get} /v1/refund/requests?:type&:tutorId&:status&:code Get list
     * @apiUse paginationQuery
     * @apiParam {String} [type] `paypal` or `bank-account`
     * @apiParam {String} [status] Allow empty, `approved` or `rejected`
     * @apiParam {String} [tutorId] The tutor, allow for admin account only
     * @apiParam {String} [code] search text for code
     * @apiPermission admin user
     */
  router.get(
    '/v1/refund/requests',
    Middleware.isAuthenticated,
    refundController.list,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup Refund_Request
   * @apiVersion 1.0.0
   * @apiName Find one
   * @api {get} /v1/refund/requests/:refundRequestId Find detail
   * @apiParam {String} refundRequestId
   * @apiPermission admin user
   */
  router.get(
    '/v1/refund/requests/:refundRequestId',
    Middleware.isAuthenticated,
    refundController.findOne,
    Middleware.Response.success('refundRequest')
  );
}