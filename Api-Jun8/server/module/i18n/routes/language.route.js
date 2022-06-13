const languageController = require('../controllers/i18n-language.controller');

module.exports = (router) => {
  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {get} /v1/i18n/languages Create new language
   * @apiParam {String} key iso code for language like `en`, `fr`
   * @apiParam {String} name
   * @apiParam {String} flag
   * @apiParam {Boolean} [isDefault] default is `false`
   * @apiParam {Boolean} [isActive] default is `true`
   * @apiPermission all
   */
  router.post(
    '/v1/i18n/languages',
    Middleware.hasRole('admin'),
    languageController.create,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {get} /v1/i18n/languages/:languageId Update language
   * @apiParam {String} languageId
   * @apiParam {String} [key] iso code for language like `en`, `fr`
   * @apiParam {String} [name]
   * @apiParam {String} [flag]
   * @apiParam {Boolean} [isDefault] default is `false`
   * @apiParam {Boolean} [isActive] default is `true`
   * @apiPermission all
   */
  router.put(
    '/v1/i18n/languages/:languageId',
    Middleware.hasRole('admin'),
    languageController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {delete} /v1/i18n/languages/:languageId Remove a language
   * @apiParam {String} languageId
   * @apiPermission all
   */
  router.delete(
    '/v1/i18n/languages/:languageId',
    Middleware.hasRole('admin'),
    languageController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup I18N
   * @apiVersion 1.0.0
   * @api {get} /v1/i18n/languages?page&take&sort&sortType Get list languages
   * @apiDescription Get all supported languages. If user will query all
   * @apiPermission all
   */
  router.get(
    '/v1/i18n/languages',
    Middleware.loadUser,
    languageController.list,
    Middleware.Response.success('list')
  );
};
