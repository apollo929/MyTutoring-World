const bannerController = require('./controllers/banner.controller');

exports.model = {
  Banner: require('./models/banner')
};

exports.router = (router) => {
  /**
   * @apiDefine bannerRequest
   * @apiParam {String}   title       banner title
   * @apiParam {String}   [content]
   * @apiParam {Number}   [ordering]
   * @apiParam {String}   [position] Position of the banner. like `home`, `category`...
   * @apiParam {String}   [mediaId] File Id
   * @apiParam {String}   [link] Link of the banner
   * @apiParam {Object}   [meta] any custom meta data
   */

  /**
   * @apiGroup Banner
   * @apiVersion 1.0.0
   * @api {post} /v1/banners  Create new banner
   * @apiDescription Create new banner
   * @apiUse authRequest
   * @apiUse bannerRequest
   * @apiPermission superadmin
   */
  router.post(
    '/v1/banners',
    Middleware.hasRole('admin'),
    bannerController.create,
    Middleware.Response.success('banner')
  );

  /**
   * @apiGroup Banner
   * @apiVersion 1.0.0
   * @api {put} /v1/banners/:id  Update a banner
   * @apiDescription Update a banner
   * @apiUse authRequest
   * @apiParam {String}   id        banner id
   * @apiUse bannerRequest
   * @apiPermission superadmin
   */
  router.put(
    '/v1/banners/:id',
    Middleware.hasRole('admin'),
    bannerController.findOne,
    bannerController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Banner
   * @apiVersion 1.0.0
   * @api {delete} /v1/banners/:id Remove a banner
   * @apiDescription Remove a banner
   * @apiUse bannerRequest
   * @apiParam {String}   id        banner id
   * @apiPermission superadmin
   */
  router.delete(
    '/v1/banners/:id',
    Middleware.hasRole('admin'),
    bannerController.findOne,
    bannerController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Banner
   * @apiVersion 1.0.0
   * @api {get} /v1/banners?:title&:location&page&take  Get list banners
   * @apiDescription Get list banners
   * @apiParam {String}   [title] title of banner
   * @apiParam {String}   [position] banner position
   * @apiPermission all
   */
  router.get(
    '/v1/banners',
    bannerController.list,
    Middleware.Response.success('bannerList')
  );

  /**
   * @apiGroup Banner
   * @apiVersion 1.0.0
   * @api {get} /v1/banners/random?:title&:locatione&take  Get random banners
   * @apiDescription Get random banners
   * @apiParam {String}   [title] title of banner
   * @apiParam {String}   [position] banner position
   * @apiParam {Number}   [take] num of item should return
   * @apiPermission all
   */
  router.get(
    '/v1/banners/random',
    bannerController.random,
    Middleware.Response.success('bannerList')
  );

  /**
   * @apiGroup Banner
   * @apiVersion 1.0.0
   * @api {get} /v1/banners/:id Get banner details
   * @apiDescription Get banner details
   * @apiParam {String}   id        banner id
   * @apiPermission all
   */
  router.get(
    '/v1/banners/:id',
    bannerController.findOne,
    Middleware.Response.success('banner')
  );
};
