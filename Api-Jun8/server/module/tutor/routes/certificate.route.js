const certificateController = require('../controllers/certificate.controller');

module.exports = router => {
  /**
   * @apiDefine certificateRequest
   * @apiParam {String}   title       certificate title
   * @apiParam {String}   [description]
   * @apiParam {String}   [fromYear]
   * @apiParam {String}   [toYear],
   * @apiParam {String}   [documentId]
   * @apiParam {String}   [type]
   * @apiParam {Boolean}   [verified]
   * @apiParam {String}   [tutorId]
   * @apiParam {Number}   [ordering]
   */

  /**
   * @apiGroup Certificate
   * @apiVersion 1.0.0
   * @api {certificate} /v1/certificates  Create new certificate
   * @apiDescription Create new certificate
   * @apiUse authRequest
   * @apiUse certificateRequest
   * @apiPermission superadmin && tutor
   */
  router.post(
    '/v1/certificates',
    Middleware.isAuthenticated,
    certificateController.create,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup Certificate
   * @apiVersion 1.0.0
   * @api {put} /v1/certificates/:id  Update a certificate
   * @apiDescription Update a certificate
   * @apiUse authRequest
   * @apiParam {String}   id        certificate id
   * @apiUse certificateRequest
   * @apiPermission superadmin
   */
  router.put(
    '/v1/certificates/:id',
    Middleware.isAuthenticated,
    certificateController.findOne,
    certificateController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Certificate
   * @apiVersion 1.0.0
   * @api {delete} /v1/certificates/:id Remove a certificate
   * @apiDescription Remove a certificate
   * @apiParam {String}   id        certificate id
   * @apiPermission superadmin
   */
  router.delete(
    '/v1/certificates/:id',
    Middleware.isAuthenticated,
    certificateController.findOne,
    certificateController.delete,
    Middleware.Response.success('delete')
  );
};
