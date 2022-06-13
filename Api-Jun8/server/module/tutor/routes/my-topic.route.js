const topicController = require('../controllers/my-topic.controller');

module.exports = router => {
  /**
   * @apiDefine topicRequest
   * @apiParam {String}   name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [price]
   */

  /**
   * @apiGroup Topic
   * @apiVersion 1.0.0
   * @api {post} /v1/my-topics  Create new topic
   * @apiDescription Create new topic
   * @apiUse authRequest
   * @apiUse topicRequest
   * @apiPermission admin
   */
  router.post('/v1/my-topic', Middleware.isAuthenticated, topicController.create, Middleware.Response.success('topic'));

  /**
   * @apiGroup Topic
   * @apiVersion 1.0.0
   * @api {put} /v1/my-topics/:topicId  Update a saubject
   * @apiDescription Update a topic
   * @apiUse authRequest
   * @apiParam {String}   id        topic id
   * @apiUse topicRequest
   * @apiPermission admin
   */
  router.put('/v1/my-topic/:id', Middleware.isAuthenticated, topicController.findOne, topicController.update, Middleware.Response.success('update'));

  /**
   * @apiGroup Topic
   * @apiVersion 1.0.0
   * @api {delete} /v1/my-topics/:topicId Remove a topic
   * @apiDescription Remove a topic
   * @apiUse topicRequest
   * @apiParam {String}   id        topic id
   * @apiPermission admin
   */
  router.delete(
    '/v1/my-topic/:id',
    Middleware.isAuthenticated,
    topicController.findOne,
    topicController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Topic
   * @apiVersion 1.0.0
   * @api {get} /v1/my-topics/:topicId Get topic details
   * @apiDescription Get topic details
   * @apiParam {String}   id        topic id
   * @apiPermission all
   */
  router.get('/v1/my-topic/:id', Middleware.isAuthenticated, topicController.findOne, Middleware.Response.success('topic'));

  /**
   * @apiGroup Topic
   * @apiVersion 1.0.0
   * @api {get} /v1/my-topics?:name&:alias  Get list my-topics
   * @apiDescription Get list my-topics
   * @apiParam {String}   [name]      topic name
   * @apiParam {String}   [alias]     topic alias
   * @apiPermission all
   */
  router.get('/v1/my-topics', topicController.list, Middleware.Response.success('list'));
  router.get('/v1/my-topics/me', Middleware.isAuthenticated, topicController.listOfMe, Middleware.Response.success('listOfMe'));
};
