const subjectController = require('../controllers/mySubject.controller');

module.exports = router => {
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
   * @api {post} /v1/my-subjects  Create new subject
   * @apiDescription Create new subject
   * @apiUse authRequest
   * @apiUse subjectRequest
   * @apiPermission admin
   */
  router.post('/v1/my-subject', Middleware.isAuthenticated, subjectController.create, Middleware.Response.success('subject'));

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {put} /v1/my-subjects/:subjectId  Update a subject
   * @apiDescription Update a subject
   * @apiUse authRequest
   * @apiParam {String}   id        subject id
   * @apiUse subjectRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/my-subject/:id',
    Middleware.isAuthenticated,
    subjectController.findOne,
    subjectController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {delete} /v1/my-subjects/:subjectId Remove a subject
   * @apiDescription Remove a subject
   * @apiUse subjectRequest
   * @apiParam {String}   id        subject id
   * @apiPermission admin
   */
  router.delete(
    '/v1/my-subject/:id',
    Middleware.isAuthenticated,
    subjectController.findOne,
    subjectController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {get} /v1/my-subjects/:subjectId Get subject details
   * @apiDescription Get subject details
   * @apiParam {String}   id        subject id
   * @apiPermission all
   */
  router.get('/v1/my-subject/:id', Middleware.isAuthenticated, subjectController.findOne, Middleware.Response.success('subject'));

  /**
   * @apiGroup Subject
   * @apiVersion 1.0.0
   * @api {get} /v1/my-subjects?:name&:alias  Get list my-subjects
   * @apiDescription Get list my-subjects
   * @apiParam {String}   [name]      subject name
   * @apiParam {String}   [alias]     subject alias
   * @apiPermission all
   */
  router.get('/v1/my-subjects', subjectController.list, Middleware.Response.success('list'));
  router.get('/v1/my-subjects/me', Middleware.isAuthenticated, subjectController.listOfMe, Middleware.Response.success('listOfMe'));
};
