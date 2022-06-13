const contactController = require('../controllers/contact.controller');

module.exports = (router) => {
  /**
   * @apiGroup Contact
   * @apiVersion 1.0.0
   * @api {get} /v1/contact  Send contacts
   * @apiDescription Send contact to user
   * @apiParam {String}  name
   * @apiParam {String}  email
   * @apiParam {String}  message
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "success": true
   *     },
   *     "error": false
   *  }
   * @apiPermission all
   */
  router.post(
    '/v1/contact',
    contactController.send,
    Middleware.Response.success('send')
  );
};
