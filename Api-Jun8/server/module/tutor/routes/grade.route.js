const gradeController = require('../controllers/grade.controller');

module.exports = (router) => {
  /**
   * @apiDefine gradeRequest
   * @apiParam {String}   name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [ordering]
   * @apiParam {String} [type] type is `high-school`, `middle-school`, `elementary`, `college`
   */

  /**
   * @apiGroup Grade
   * @apiVersion 1.0.0
   * @api {post} /v1/grades  Create new grade
   * @apiDescription Create new grade
   * @apiUse authRequest
   * @apiUse gradeRequest
   * @apiPermission admin
   */
  router.post(
    '/v1/grades',
    Middleware.hasRole('admin'),
    gradeController.create,
    Middleware.Response.success('grade')
  );

  /**
   * @apiGroup Grade
   * @apiVersion 1.0.0
   * @api {put} /v1/grades/:gradeId  Update a grade
   * @apiDescription Update a grade
   * @apiUse authRequest
   * @apiParam {String}   id        grade id
   * @apiUse gradeRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/grades/:gradeId',
    Middleware.hasRole('admin'),
    gradeController.findOne,
    gradeController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Grade
   * @apiVersion 1.0.0
   * @api {delete} /v1/grades/:gradeId Remove a grade
   * @apiDescription Remove a grade
   * @apiUse gradeRequest
   * @apiParam {String}   id        grade id
   * @apiPermission admin
   */
  router.delete(
    '/v1/grades/:gradeId',
    Middleware.hasRole('admin'),
    gradeController.findOne,
    gradeController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Grade
   * @apiVersion 1.0.0
   * @api {get} /v1/grades/:gradeId Get grade details
   * @apiDescription Get grade details
   * @apiParam {String}   id        grade id
   * @apiPermission all
   */
  router.get(
    '/v1/grades/:gradeId',
    gradeController.findOne,
    Middleware.Response.success('grade')
  );

  /**
   * @apiGroup Grade
   * @apiVersion 1.0.0
   * @api {get} /v1/grades?:name&:alias  Get list grades
   * @apiDescription Get list grades
   * @apiParam {String}   [name]      grade name
   * @apiParam {String}   [alias]     grade alias
   * @apiPermission all
   */
  router.get(
    '/v1/grades',
    gradeController.list,
    Middleware.Response.success('list')
  );
};
