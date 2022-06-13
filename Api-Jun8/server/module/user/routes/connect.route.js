const connectController = require('../controllers/connect.controller');

module.exports = (router) => {
  /**
   * @apiGroup Connect Social
   * @apiVersion 1.0.0
   * @api {post} /v1/connect/facebook Facebook
   * @apiUse authRequest
   * @apiParam {String} accessToken Facebook access token
   *
   * @apiSuccessExample {json} Response-Success
   * {
   *    "code": 200,
   *    "message": "OK",
   *    "data": {
   *        "success": true
   *    },
   *    "error": false
   * }
   * @apiPermission user
   */
  router.post(
    '/v1/connect/facebook',
    Middleware.isAuthenticated,
    connectController.connectFacebook,
    Middleware.Response.success('connect')
  );

  /**
   * @apiGroup Connect Social
   * @apiVersion 1.0.0
   * @api {post} /v1/connect/google Google
   * @apiUse authRequest
   * @apiParam {String} accessToken Google plus access token
   *
   * @apiSuccessExample {json} Response-Success
   * {
   *    "code": 200,
   *    "message": "OK",
   *    "data": {
   *        "success": true
   *    },
   *    "error": false
   * }
   * @apiPermission user
   */
  router.post(
    '/v1/connect/google',
    Middleware.isAuthenticated,
    connectController.connectGoogle,
    Middleware.Response.success('connect')
  );
};
