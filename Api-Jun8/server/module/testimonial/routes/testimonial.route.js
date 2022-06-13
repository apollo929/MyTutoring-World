const testimonialController = require('../controllers/testimonial.controller');

module.exports = router => {
  /**
   * @apiDefine testimonialRequest
   * @apiParam {String}   name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [price]
   */

  /**
   * @apiGroup Testimonial
   * @apiVersion 1.0.0
   * @api {post} /v1/testimonials  Create new testimonial
   * @apiDescription Create new testimonial
   * @apiUse authRequest
   * @apiUse testimonialRequest
   * @apiPermission admin
   */
  router.post(
    '/v1/testimonials',
    Middleware.hasRole('admin'),
    testimonialController.create,
    Middleware.Response.success('testimonial')
  );

  /**
   * @apiGroup Testimonial
   * @apiVersion 1.0.0
   * @api {put} /v1/testimonials/:testimonialId  Update a testimonial
   * @apiDescription Update a testimonial
   * @apiUse authRequest
   * @apiParam {String}   id        testimonial id
   * @apiUse testimonialRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/testimonials/:testimonialId',
    Middleware.hasRole('admin'),
    testimonialController.findOne,
    testimonialController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Testimonial
   * @apiVersion 1.0.0
   * @api {delete} /v1/testimonials/:testimonialId Remove a testimonial
   * @apiDescription Remove a testimonial
   * @apiUse testimonialRequest
   * @apiParam {String}   id        testimonial id
   * @apiPermission admin
   */
  router.delete(
    '/v1/testimonials/:testimonialId',
    Middleware.hasRole('admin'),
    testimonialController.findOne,
    testimonialController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Testimonial
   * @apiVersion 1.0.0
   * @api {get} /v1/testimonials/:testimonialId Get testimonial details
   * @apiDescription Get testimonial details
   * @apiParam {String}   id        testimonial id
   * @apiPermission all
   */
  router.get(
    '/v1/testimonials/:testimonialId',
    testimonialController.findOne,
    Middleware.Response.success('testimonial')
  );

  /**
   * @apiGroup Testimonial
   * @apiVersion 1.0.0
   * @api {get} /v1/testimonials?:name&:alias  Get list testimonials
   * @apiDescription Get list testimonials
   * @apiParam {String}   [name]      testimonial name
   * @apiParam {String}   [alias]     testimonial alias
   * @apiPermission all
   */
  router.get('/v1/testimonials', testimonialController.list, Middleware.Response.success('list'));
};
