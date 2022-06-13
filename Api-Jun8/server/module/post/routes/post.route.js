const postController = require('../controllers/post.controller');

module.exports = (router) => {
  /**
   * @apiDefine postRequest
   * @apiParam {String}   title       post title
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [content]
   * @apiParam {Number}   [ordering]
   * @apiParam {String[]}   [categoryIds] category id
   */

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {post} /v1/posts  Create new post
   * @apiDescription Create new post
   * @apiUse authRequest
   * @apiUse postRequest
   * @apiPermission superadmin
   */
  router.post(
    '/v1/posts',
    Middleware.hasRole('admin'),
    postController.create,
    Middleware.Response.success('post')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {put} /v1/posts/:id  Update a post
   * @apiDescription Update a post
   * @apiUse authRequest
   * @apiParam {String}   id        post id
   * @apiUse postRequest
   * @apiPermission superadmin
   */
  router.put(
    '/v1/posts/:id',
    Middleware.hasRole('admin'),
    postController.findOne,
    postController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {delete} /v1/posts/:id Remove a post
   * @apiDescription Remove a post
   * @apiUse postRequest
   * @apiParam {String}   id        post id
   * @apiPermission superadmin
   */
  router.delete(
    '/v1/posts/:id',
    Middleware.hasRole('admin'),
    postController.findOne,
    postController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {get} /v1/posts/:id Get post details
   * @apiDescription Get post details
   * @apiParam {String}   id        post id
   * @apiPermission all
   */
  router.get(
    '/v1/posts/:id',
    postController.findOne,
    Middleware.Response.success('post')
  );

  /**
   * @apiGroup Post
   * @apiVersion 1.0.0
   * @api {get} /v1/posts?:name&:alias&type  Get list posts
   * @apiDescription Get list posts
   * @apiParam {String}   [name]      post name
   * @apiParam {String}   [alias]     post alias
   * @apiParam {String}   [type]     post type
   * @apiPermission all
   */
  router.get(
    '/v1/posts',
    postController.list,
    Middleware.Response.success('list')
  );
};
