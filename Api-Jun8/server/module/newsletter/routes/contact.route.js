const contactController = require('../controllers/contact.controller');

module.exports = (router) => {
  /**
   * @apiGroup Newsletter
   * @apiVersion 1.0.0
   * @apiName Register
   * @api {post} /v1/newsletter/contact
   * @apiDescription Register as newsletter member
   * @apiUse authRequest
   * @apiParam {String} email
   * @apiParam {String} [name]
   * @apiParam {String} [address]
   * @apiSuccessExample {json} Success-Response
   * {
   *    "code": 200,
   *    "message": "OK",
   *    "data": {
   *      "success": true
   *    },
   *    "error": false
   * }
   * @apiPermission all
   */
  router.post(
    '/v1/newsletter/contact',
    contactController.register,
    Middleware.Response.success('register')
  );

  /**
   * @apiGroup Newsletter
   * @apiVersion 1.0.0
   * @apiName List contacts
   * @api {get} /v1/newsletter/contact
   * @apiDescription List all contacts who register newsletter
   * @apiUse authRequest
   * @apiUse paginationQuery
   * @apiSuccessExample {json} Success-Response
   * {
   *    "code": 200,
   *    "message": "OK",
   *    "data": {
   *      "count": 100,
   *      "items": []
   *    },
   *    "error": false
   * }
   * @apiPermission admin
   */
  router.get(
    '/v1/newsletter/contact',
    Middleware.hasRole('admin'),
    contactController.list,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup Newsletter
   * @apiVersion 1.0.0
   * @apiName Remove contact
   * @api {delete} /v1/newsletter/contact/:contactId
   * @apiUse authRequest
   * @apiSuccessExample {json} Success-Response
   * {
   *    "code": 200,
   *    "message": "OK",
   *    "data": {
   *      "success": true
   *    },
   *    "error": false
   * }
   * @apiPermission admin
   */
  router.delete(
    '/v1/newsletter/contact/:contactId',
    Middleware.hasRole('admin'),
    contactController.remove,
    Middleware.Response.success('remove')
  );
};
