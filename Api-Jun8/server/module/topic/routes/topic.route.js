const topicCtr = require('../controllers/topic.controller');

module.exports = router => {
  /**
   * @apiDefine topicRequest
   * @apiParam {String}   name        Topic name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [ordering]
   */

  /**
   * @apiGroup  Topic
   * @apiVersion 1.0.0
   * @api {post} /v1/topics  Create new  topic
   * @apiDescription Create new topic
   * @apiUse authRequest
   * @apiUse topicRequest
   * @apiPermission superadmin
   */
  router.post('/v1/topics', Middleware.hasRole('admin'), topicCtr.create, Middleware.Response.success('topic'));

  /**
   * @apiGroup  Topic
   * @apiVersion 1.0.0
   * @api {put} /v1/topics/:id  Update a topic
   * @apiDescription Update a topic
   * @apiUse authRequest
   * @apiParam {String}   id        Topic id
   * @apiUse topicRequest
   * @apiPermission superadmin
   */
  router.put('/v1/topics/:id', Middleware.hasRole('admin'), topicCtr.findOne, topicCtr.update, Middleware.Response.success('update'));

  /**
   * @apiGroup  Topic
   * @apiVersion 1.0.0
   * @api {delete} /v1/topics/:id Remove a topic
   * @apiDescription Remove a topic
   * @apiUse authRequest
   * @apiParam {String}   id        Topic id
   * @apiPermission superadmin
   */
  router.delete('/v1/topics/:id', Middleware.hasRole('admin'), topicCtr.findOne, topicCtr.remove, Middleware.Response.success('remove'));

  /**
   * @apiGroup  Topic
   * @apiVersion 1.0.0
   * @api {get} /v1/topics/:id Get topic details
   * @apiDescription Get topic details
   * @apiParam {String}   id        Topic id
   * @apiPermission all
   */
  router.get('/v1/topics/:id', Middleware.isAuthenticated, topicCtr.findOne, Middleware.Response.success('topic'));

  /**
   * @apiGroup  Topic
   * @apiVersion 1.0.0
   * @api {get} /v1/topics?:name&:alias  Get list topics
   * @apiDescription Get list topics
   * @apiParam {String}   [name]      topic name
   * @apiParam {String}   [alias]     topic alias
   * @apiPermission all
   */
  router.get(
    '/v1/topics',
    // Middleware.isAuthenticated,
    topicCtr.list,
    Middleware.Response.success('list')
  );
};
