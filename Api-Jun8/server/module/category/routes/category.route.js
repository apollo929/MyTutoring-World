const categoryCtr = require('../controllers/category.controller');

module.exports = router => {
  /**
   * @apiDefine categoryRequest
   * @apiParam {String}   name        Category name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [ordering]
   */

  /**
   * @apiGroup  Category
   * @apiVersion 1.0.0
   * @api {post} /v1/categories  Create new  category
   * @apiDescription Create new category
   * @apiUse authRequest
   * @apiUse categoryRequest
   * @apiPermission superadmin
   */
  router.post(
    '/v1/categories',
    Middleware.hasRole('admin'),
    categoryCtr.create,
    Middleware.Response.success('category')
  );

  /**
   * @apiGroup  Category
   * @apiVersion 1.0.0
   * @api {put} /v1/categories/:id  Update a category
   * @apiDescription Update a category
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiUse categoryRequest
   * @apiPermission superadmin
   */
  router.put(
    '/v1/categories/:id',
    Middleware.hasRole('admin'),
    categoryCtr.findOne,
    categoryCtr.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup  Category
   * @apiVersion 1.0.0
   * @api {delete} /v1/categories/:id Remove a category
   * @apiDescription Remove a category
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiPermission superadmin
   */
  router.delete(
    '/v1/categories/:id',
    Middleware.hasRole('admin'),
    categoryCtr.findOne,
    categoryCtr.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup  Category
   * @apiVersion 1.0.0
   * @api {get} /v1/categories/:id Get category details
   * @apiDescription Get category details
   * @apiParam {String}   id        Category id
   * @apiPermission all
   */
  router.get(
    '/v1/categories/:id',
    Middleware.isAuthenticated,
    categoryCtr.findOne,
    Middleware.Response.success('category')
  );

  /**
   * @apiGroup  Category
   * @apiVersion 1.0.0
   * @api {get} /v1/categories?:name&:alias  Get list categories
   * @apiDescription Get list categories
   * @apiParam {String}   [name]      category name
   * @apiParam {String}   [alias]     category alias
   * @apiPermission all
   */
  router.get(
    '/v1/categories',
    // Middleware.isAuthenticated,
    categoryCtr.list,
    Middleware.Response.success('list')
  );
};
