const messageController = require('../controllers/message.controller');

module.exports = router => {
  /**
   * @apiDefine messageRequest
   * @apiParam {String}   type `text` or `file`
   * @apiParam {String}   conversationId message group id
   * @apiParam {String}   [text] text message
   * @apiParam {String}   [fileId] uuid of file from Media module
   */

  /**
   * @apiGroup Message
   * @apiVersion 1.0.0
   * @api {get} /v1/messages/conversations/:conversationId?:page&:take&:q Get list messages by group
   * @apiDescription Get list messages by group
   * @apiParam {String}   [q] Search keyword, will search by text
   * @apiPermission user
   */
  router.get(
    '/v1/messages/conversations/:conversationId',
    Middleware.isAuthenticated,
    messageController.groupMessages,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup Message
   * @apiVersion 1.0.0
   * @api {get} /v1/messages/latest?:page&:take&:q Get latest messages
   * @apiDescription Get list messages with sender is not current user
   * @apiParam {String}   [q] Search keyword, will search by text
   * @apiPermission user
   */
  router.get('/v1/messages/latest', Middleware.isAuthenticated, messageController.latest, Middleware.Response.success('latest'));

  /**
   * @apiGroup Message
   * @apiVersion 1.0.0
   * @api {post} /v1/messages/conversations/:conversationId/read Set read status for conversation
   * @apiDescription Set read status for conversation
   * @apiParam {String}   conversationId
   * @apiParam {Boolean}  [all] If not pass, will reduce 1
   * @apiPermission user
   */
  router.post(
    '/v1/messages/conversations/:conversationId/read',
    Middleware.isAuthenticated,
    messageController.read,
    Middleware.Response.success('read')
  );

  /**
   * @apiGroup Message
   * @apiVersion 1.0.0
   * @api {post} /v1/messages  Create a new message
   * @apiDescription Create new message
   * @apiUse authRequest
   * @apiUse messageRequest
   * @apiPermission user
   */
  router.post('/v1/messages', Middleware.isAuthenticated, messageController.create, Middleware.Response.success('create'));

  router.post(
    '/v1/messages/send-to-admin',
    Middleware.isAuthenticated,
    messageController.sendMessageToAdmin,
    Middleware.Response.success('sendToAdmin')
  );

  /**
   * @apiGroup Message
   * @apiVersion 1.0.0
   * @api {delete} /v1/messages/:messageId  Delete a message
   * @apiUse authRequest
   * @apiUse messageRequest
   * @apiPermission user
   */
  router.delete('/v1/messages/:messageId', Middleware.isAuthenticated, messageController.remove, Middleware.Response.success('remove'));
};
