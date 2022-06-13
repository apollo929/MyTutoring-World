const configController = require('../controllers/config.controller');

module.exports = router => {
  /**
   * @apiDefine configRequest
   * @apiParam {Object}   value        Any value type
   */

  /**
   * @apiGroup System
   * @apiVersion 1.0.0
   * @api {get} /v1/system/configs  Get list configs
   * @apiDescription Get list configs
   * @apiPermission admin
   */
  router.get(
    '/v1/system/configs',
    Middleware.hasRole('admin'),
    configController.list,
    Middleware.Response.success('configs')
  );

  /**
   * @apiGroup System
   * @apiVersion 1.0.0
   * @api {put} /v1/system/configs/:id  Update a config
   * @apiDescription Update a config
   * @apiUse authRequest
   * @apiParam {String}   id        config id
   * @apiUse configRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/system/configs/:id',
    Middleware.hasRole('admin'),
    configController.findOne,
    configController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup System
   * @apiVersion 1.0.0
   * @api {get} /v1/system/configs
   * @apiPermission all
   */
  router.get('/v1/system/configs/public', configController.publicConfig, Middleware.Response.success('publicConfig'));

  router.get('/v1/system/check-zip-code', configController.getAddress, Middleware.Response.success('getAddress'));
};
