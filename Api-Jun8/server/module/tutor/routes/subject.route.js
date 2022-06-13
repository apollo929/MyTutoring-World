const subjectController = require('../controllers/subject.controller');

module.exports = (router) => {
  /**
   * @apiDefine subjectRequest
   * @apiParam {String}   name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [price]
   */

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {post} /v1/subjects  Create new subject
   * @apiDescription Create new subject
   * @apiUse authRequest
   * @apiUse subjectRequest
   * @apiPermission admin
   */
  router.post(
    '/v1/subjects',
    Middleware.hasRole('admin'),
    subjectController.create,
    Middleware.Response.success('subject')
  );

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {put} /v1/subjects/:subjectId  Update a subject
   * @apiDescription Update a subject
   * @apiUse authRequest
   * @apiParam {String}   id        subject id
   * @apiUse subjectRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/subjects/:subjectId',
    Middleware.hasRole('admin'),
    subjectController.findOne,
    subjectController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {delete} /v1/subjects/:subjectId Remove a subject
   * @apiDescription Remove a subject
   * @apiUse subjectRequest
   * @apiParam {String}   id        subject id
   * @apiPermission admin
   */
  router.delete(
    '/v1/subjects/:subjectId',
    Middleware.hasRole('admin'),
    subjectController.findOne,
    subjectController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {get} /v1/subjects/:subjectId Get subject details
   * @apiDescription Get subject details
   * @apiParam {String}   id        subject id
   * @apiPermission all
   */
  router.get(
    '/v1/subjects/:subjectId',
    subjectController.findOne,
    Middleware.Response.success('subject')
  );

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {get} /v1/subjects?:name&:alias  Get list subjects
   * @apiDescription Get list subjects
   * @apiParam {String}   [name]      subject name
   * @apiParam {String}   [alias]     subject alias
   * @apiPermission all
   */
  router.get(
    '/v1/subjects',
    subjectController.list,
    Middleware.Response.success('list')
  );
};
