const bookingController = require('../controllers/booking.controller');

module.exports = router => {
  /**
   * @apiGroup Booking
   * @apiVersion 1.0.0
   * @apiName Create
   * @api {post} /v1/appointments/book New booking
   * @apiParam {String}   startTime start time in UTC time format
   * @apiParam {String}   toTime to time in UTC time format
   * @apiParam {String}   subjectId
   * @apiParam {String}   tutorId
   * @apiParam {Boolean}  [isFree]
   * @apiParam {String}  [redirectSuccessUrl]
   * @apiParam {String}  [cancelUrl]
   * @apiParam {String}  [stripeToken] Token for stripe
   * @apiParamExample {json} Request-Example:
   * {
   *     "startTime": "2018-08-27T08:12:56.939Z",
   *     "toTime": "2018-08-27T08:12:56.939Z"
   *     "subjectId": "5b83b28890bcc22a0a614449"
   *     "tutorId": "5b83b28890bcc22a0a614449",
   *     "isFree": true
   * }
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "_id": "5b99efc048d35953fbd9e93f",
   *         "status": "pending"
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.post('/v1/appointments/book', Middleware.isAuthenticated, bookingController.create, Middleware.Response.success('create'));

  /**
   * @apiGroup Booking
   * @apiVersion 1.0.0
   * @apiName Check can add free book
   * @api {post} /v1/appointments/check/free Check can add free book
   * @apiParam {String}   tutorId
   * @apiParamExample {json} Request-Example:
   * {
   *     "tutorId": "5b83b28890bcc22a0a614449"
   * }
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "canBookFree": true
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.post('/v1/appointments/check/free', Middleware.isAuthenticated, bookingController.checkFreeBooking, Middleware.Response.success('check'));

  router.post(
    '/v1/appointments/check/overlap',
    Middleware.isAuthenticated,
    bookingController.checkOverlapSlot,
    Middleware.Response.success('checkOverlap')
  );
};
