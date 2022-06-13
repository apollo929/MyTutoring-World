const phoneController = require('../controllers/phone.controller');

module.exports = (router) => {
  /**
   * @apiGroup User
   * @apiVersion 1.0.0
   * @api {put} /v1/phone Change user phone
   * @apiUse authRequest
   * @apiParam {String}   phoneNumber
   *
   * @apiSuccessExample {json} Response-Success
   * {
   *    "code": 200,
   *    "message": "OK",
   *    "data": {
   *        "message": "A verify code has been sent to your phone number"
   *    },
   *    "error": false
   * }
   * @apiPermission user
   */
  router.put(
    '/v1/phone',
    Middleware.isAuthenticated,
    phoneController.changePhone,
    Middleware.Response.success('changePhone')
  );

  /**
   * @apiGroup User
   * @apiVersion 1.0.0
   * @api {post} /v1/phone/verify Verify phone number
   * @apiUse authRequest
   * @apiParam {String}   phoneNumber
   * @apiParam {String}   code
   *
   * @apiSuccessExample {json} Response-Success
   * {
   *    "code": 200,
   *    "message": "OK",
   *    "data": {
   *        "message": "Your phone number has been verifie",
   *        "success": true
   *    },
   *    "error": false
   * }
   * @apiPermission user
   */
  router.post(
    '/v1/phone/verify',
    Middleware.isAuthenticated,
    phoneController.verifyPhone,
    Middleware.Response.success('verifyPhone')
  );
};
