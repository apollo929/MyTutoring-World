const categoryController = require('../controllers/category.controller');

module.exports = (router) => {
  /**
   * @apiDefine postCategoryRequest
   * @apiParam {String}   name        Category name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [ordering]
   */

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {post} /v1/posts/categories  Create new category
   * @apiDescription Create new category
   * @apiUse authRequest
   * @apiUse postCategoryRequest
   * @apiPermission superadmin
   */
  router.post(
    '/v1/posts/categories',
    Middleware.hasRole('admin'),
    categoryController.create,
    Middleware.Response.success('postCategory')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {put} /v1/posts/categories/:id  Update a category
   * @apiDescription Update a category
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiUse postCategoryRequest
   * @apiPermission superadmin
   */
  router.put(
    '/v1/posts/categories/:id',
    Middleware.hasRole('admin'),
    categoryController.findOne,
    categoryController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {delete} /v1/posts/categories/:id Remove a category
   * @apiDescription Remove a category
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiPermission superadmin
   */
  router.delete(
    '/v1/posts/categories/:id',
    Middleware.hasRole('admin'),
    categoryController.findOne,
    categoryController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {get} /v1/posts/categories/:id Get category details
   * @apiDescription Get category details
   * @apiParam {String}   id        Category id
   * @apiPermission all
   */
  router.get(
    '/v1/posts/categories/:id',
    categoryController.findOne,
    Middleware.Response.success('postCategory')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {get} /v1/posts/categories?:name&:alias  Get list categories
   * @apiDescription Get list categories
   * @apiParam {String}   [name]      category name
   * @apiParam {String}   [alias]     category alias
   * @apiPermission all
   */
  router.get(
    '/v1/posts/categories',
    categoryController.list,
    Middleware.Response.success('list')
  );
};
