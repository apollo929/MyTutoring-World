const translationController = require('../controllers/i18n-translation.controller');

module.exports = (router) => {
  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {post} /v1/i18n/translations Create new translation
   * @apiParam {String} lang iso code of language like `en`,`fr`
   * @apiParam {String} textId
   * @apiParam {String} translation Translated text
   * @apiPermission admin
   */
  router.post(
    '/v1/i18n/translations',
    Middleware.hasRole('admin'),
    translationController.create,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {put} /v1/i18n/translations/:translationId Update a translation
   * @apiParam {String} translation Translated text
   * @apiPermission admin
   */
  router.put(
    '/v1/i18n/translations/:translationId',
    Middleware.hasRole('admin'),
    translationController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {delete} /v1/i18n/translations/:translationId Remove a translation
   * @apiParam {String} translationId
   * @apiPermission admin
   */
  router.delete(
    '/v1/i18n/translations/:translationId',
    Middleware.hasRole('admin'),
    translationController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {get} /v1/i18n/translations?page&take&sort&sortType Get list text
   * @apiDescription Get all supported languages. If user will query all
   * @apiPermission all
   */
  router.get(
    '/v1/i18n/translations',
    Middleware.hasRole('admin'),
    translationController.list,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @apiName Pull translation
   * @api {post} /v1/i18n/:lang/pull Pull text
   * @apiParam {String} lang language code
   * @apiPermission admin
   */
  router.post(
    '/v1/i18n/translations/:lang/pull',
    Middleware.hasRole('admin'),
    translationController.pull,
    Middleware.Response.success('pull')
  );
  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {get} /v1/i18n/:lang.json Get i18n translation data
   * @apiPermission all
   */
  router.get(
    '/v1/i18n/:lang.json',
    translationController.sendJSON
  );
};
