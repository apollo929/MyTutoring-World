const categoryController = require('../controllers/my-category.controller');

module.exports = router => {
  /**
   * @apiDefine categoryRequest
   * @apiParam {String}   name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [price]
   */

  /**
   * @apiGroup Category
   * @apiVersion 1.0.0
   * @api {post} /v1/my-categories  Create new category
   * @apiDescription Create new category
   * @apiUse authRequest
   * @apiUse categoryRequest
   * @apiPermission admin
   */
  router.post('/v1/my-category', Middleware.isAuthenticated, categoryController.create, Middleware.Response.success('category'));

  /**
   * @apiGroup Category
   * @apiVersion 1.0.0
   * @api {put} /v1/my-categories/:categoryId  Update a saubject
   * @apiDescription Update a category
   * @apiUse authRequest
   * @apiParam {String}   id        category id
   * @apiUse categoryRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/my-category/:id',
    Middleware.isAuthenticated,
    categoryController.findOne,
    categoryController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Category
   * @apiVersion 1.0.0
   * @api {delete} /v1/my-categories/:categoryId Remove a category
   * @apiDescription Remove a category
   * @apiUse categoryRequest
   * @apiParam {String}   id        category id
   * @apiPermission admin
   */
  router.delete(
    '/v1/my-category/:id',
    Middleware.isAuthenticated,
    categoryController.findOne,
    categoryController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Category
   * @apiVersion 1.0.0
   * @api {get} /v1/my-categories/:categoryId Get category details
   * @apiDescription Get category details
   * @apiParam {String}   id        category id
   * @apiPermission all
   */
  router.get('/v1/my-category/:id', Middleware.isAuthenticated, categoryController.findOne, Middleware.Response.success('category'));

  /**
   * @apiGroup Category
   * @apiVersion 1.0.0
   * @api {get} /v1/my-categories?:name&:alias  Get list my-categories
   * @apiDescription Get list my-categories
   * @apiParam {String}   [name]      category name
   * @apiParam {String}   [alias]     category alias
   * @apiPermission all
   */
  router.get('/v1/my-categories', categoryController.list, Middleware.Response.success('list'));
  router.get('/v1/my-categories/me', Middleware.isAuthenticated, categoryController.listOfMe, Middleware.Response.success('listOfMe'));
};
