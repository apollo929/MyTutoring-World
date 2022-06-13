const textController = require('../controllers/i18n-text.controller');

module.exports = router => {
  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {post} /v1/i18n/text Create new text
   * @apiParam {String} text text key need to be translated
   * @apiPermission admin
   */
  router.post(
    '/v1/i18n/text',
    Middleware.hasRole('admin'),
    textController.create,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {put} /v1/i18n/text/:textId Update text
   * @apiParam {String} textId
   * @apiParam {String} text text key need to be translated
   * @apiPermission admin
   */
  router.put(
    '/v1/i18n/text/:textId',
    Middleware.hasRole('admin'),
    textController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {delete} /v1/i18n/text/:textId Remove a text
   * @apiParam {String} textId
   * @apiPermission admin
   */
  router.delete(
    '/v1/i18n/text/:textId',
    Middleware.hasRole('admin'),
    textController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {get} /v1/i18n/textId?page&take&sort&sortType Get list text
   * @apiDescription Get all supported languages. If user will query all
   * @apiPermission all
   */
  router.get('/v1/i18n/text', Middleware.hasRole('admin'), textController.list, Middleware.Response.success('list'));
};
