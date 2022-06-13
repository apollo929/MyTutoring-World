const transactionController = require('../controllers/transaction.controller');

module.exports = router => {
  /**
   * @apiGroup Transaction
   * @apiVersion 1.0.0
   * @api {get} /v1/payment/transactions?:status&:userId&:type Listing
   * @apiParam {String}   [status]  `pending`, `canceled`, `completed`
   * @apiParam {String}   [userId]
   * @apiParam {String}   [type]
   * @apiUse paginationQuery
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "count": 10,
   *         "items": [
   *            {
   *               "_id": "....",
   *               "status": "pending"
   *            }
   *          ]
   *     },
   *     "error": false
   *  }
   * @apiPermission admin
   */
  router.get('/v1/payment/transactions', Middleware.isAuthenticated, transactionController.list, Middleware.Response.success('list'));

  /**
   * @apiGroup Transaction
   * @apiVersion 1.0.0
   * @api {get} /v1/payment/transactions/:transactionId Detail
   * @apiParam {String}   transactionId
   * @apiUse paginationQuery
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "_id": ".....",
   *         "type": "booking",
   *         "paymentGateway": "paypal",
   *         "price": 100,
   *         "user": {
   *            "_id": "....",
   *            "username": "xxxxx"
   *         }
   *     },
   *     "error": false
   *  }
   * @apiPermission admin
   */
  router.get(
    '/v1/payment/transactions/:transactionId',
    Middleware.isAuthenticated,
    transactionController.findOne,
    Middleware.Response.success('transaction')
  );

  router.post('/v1/enroll', Middleware.isAuthenticated, transactionController.enroll, Middleware.Response.success('enroll'));

  router.post('/v1/enroll/:id/:targetType/booked', Middleware.isAuthenticated, transactionController.booked, Middleware.Response.success('booked'));

  router.post(
    '/v1/webinars/check/overlap',
    Middleware.isAuthenticated,
    transactionController.checkOverlapWebinar,
    Middleware.Response.success('overlapSlots')
  );

  router.get(
    '/v1/payment/transactions-of-tutor',
    Middleware.isAuthenticated,
    transactionController.transactionOfTutor,
    Middleware.Response.success('listOfTutor')
  );

  router.get('/v1/my-course', Middleware.isAuthenticated, transactionController.myCourse, Middleware.Response.success('list'));
};
