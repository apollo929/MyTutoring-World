const reviewController = require('./controllers/review.controller');

exports.model = {
  Review: require('./models/review')
};

exports.mongoosePlugin = require('./mongoosePlugin');

exports.services = {
  Review: require('./services/Review')
};

exports.router = router => {
  /**
   * @apiGroup Review
   * @apiVersion 1.0.0
   * @apiName Review list
   * @api {get} /v1/reviews?:tutorId&:rateBy&:type  Get list reviews
   * @apiDescription Get list reviews
   * @apiParam {String}   [tutorId] review for tutor
   * @apiParam {String}   [rateBy] who reviewed
   * @apiParam {String}   [type] `appointment` for now
   * @apiPermission all
   */
  router.get('/v1/reviews', reviewController.list, Middleware.Response.success('list'));

  /**
   * @apiGroup Review
   * @apiVersion 1.0.0
   * @apiName Review create
   * @api {post} /v1/reviews  Create new review
   * @apiDescription Create new review
   * @apiUse authRequest
   * @apiParam {String}   [appointmentId] Required if type is `appointment`
   * @apiParam {String}   rating Score for rate. from 1-5
   * @apiParam {String}   comment
   * @apiParam {String}   [type] `appointment`. Default is appointment
   * @apiPermission user
   */
  router.post('/v1/reviews', Middleware.isAuthenticated, reviewController.create, Middleware.Response.success('review'));

  /**
   * @apiGroup Review
   * @apiVersion 1.0.0
   * @apiName Review update
   * @api {put} /v1/reviews/:reviewId  Update a review
   * @apiDescription Update a review
   * @apiUse authRequest
   * @apiParam {String}   reviewId        Review id
   * @apiParam {String}   rating Score for rate. from 1-5
   * @apiParam {String}   comment
   * @apiPermission user
   */
  router.put(
    '/v1/reviews/:reviewId',
    Middleware.isAuthenticated,
    reviewController.findOne,
    reviewController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Review
   * @apiVersion 1.0.0
   * @apiName Review delete
   * @api {delete} /v1/reviews/:reviewId Remove a review
   * @apiDescription Remove a review
   * @apiUse authRequest
   * @apiParam {String}   reviewId        Review id
   * @apiPermission user
   */
  router.delete(
    '/v1/reviews/:reviewId',
    Middleware.isAuthenticated,
    reviewController.findOne,
    reviewController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Review
   * @apiVersion 1.0.0
   * @api {get} /v1/reviews/:reviewId Get review details
   * @apiDescription Get review details
   * @apiParam {String}   reviewId        Review id
   * @apiPermission all
   */
  router.get('/v1/reviews/:reviewId', reviewController.findOne, Middleware.Response.success('review'));

  /**
   * @apiGroup Review
   * @apiVersion 1.0.0
   * @api {get} /v1/reviews/:type/:itemId/current Get my current review
   * @apiDescription Get review of current item
   * @apiParam {String}   type `appointment`
   * @apiParam {String}   itemId appointmentId
   * @apiPermission user
   */
  router.get('/v1/reviews/:itemId/current', Middleware.isAuthenticated, reviewController.getMyCurrentReview, Middleware.Response.success('review'));

  router.get('/v1/review/is-review', Middleware.isAuthenticated, reviewController.isReview, Middleware.Response.success('isReview'));
};
