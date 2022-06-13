const controller = require('../controllers/available-time.controller');

module.exports = (router) => {
  /**
   * @apiGroup AvailableTime
   * @apiVersion 1.0.0
   * @apiName Get list
   * @api {get} /v1/availableTime?:userId&:startTime&:toTime Listing
   * @apiDescription Option `userId` for tutor querying
   * Add large number for `take` param to get all records in the date range
   * @apiParam {String}   [userId]
   * @apiParam {String}   [startTime] Date time format in javascript
   * @apiParam {String}   [toTime] Date time format in javascript
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
   * @apiPermission all
   */
  router.get(
    '/v1/availableTime',
    Middleware.loadUser,
    controller.list,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup AvailableTime
   * @apiVersion 1.0.0
   * @apiName Create
   * @api {post} /v1/availableTime Create
   * @apiDescription Create multiple available time range. Push array to create
   * @apiParam {String}   [startTime] Date time format in javascript
   * @apiParam {String}   [toTime] Date time format in javascript
   * @apiParamExample {json} Request-Example:
   * {
   *     "startTime": "2018-08-27T08:12:56.939Z",
   *     "toTime": "2018-08-27T08:12:56.939Z"
   * }
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "_id": "5b99efc048d35953fbd9e93f",
   *         "startTime": "2018-08-27T08:12:56.939Z",
   *         "toTime": "2018-08-27T08:12:56.939Z"
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.post(
    '/v1/availableTime',
    Middleware.isAuthenticated,
    controller.create,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup AvailableTime
   * @apiVersion 1.0.0
   * @apiName Update
   * @api {put} /v1/availableTime/:availableTimeId
   * @apiParam {String}   availableTimeId
   * @apiParamExample {json} Request-Example:
   * {
   *     "startTime": "2018-08-27T08:12:56.939Z",
   *     "toTime": "2018-08-27T08:12:56.939Z"
   * }
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "_id": "5b99efc048d35953fbd9e93f",
   *         "startTime": "2018-08-27T08:12:56.939Z",
   *         "toTime": "2018-08-27T08:12:56.939Z"
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.put(
    '/v1/availableTime/:availableTimeId',
    Middleware.isAuthenticated,
    controller.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup AvailableTime
   * @apiVersion 1.0.0
   * @apiName Delete
   * @api {delete} /v1/availableTime/:availableTimeId
   * @apiParam {String}   availableTimeId
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *        "success": true
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.delete(
    '/v1/availableTime/:availableTimeId',
    Middleware.isAuthenticated,
    controller.remove,
    Middleware.Response.success('remove')
  );
};
