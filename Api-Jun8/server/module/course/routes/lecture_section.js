const controller = require('../controllers/lecture_section.controller');

module.exports = router => {
  /**
   * @apiDefine coupon
   * @apiParam {String}   [name]
   * @apiParam {String}   [code]
   * @apiParam {String}   [type]
   * @apiParam {Number}   [value]
   * @apiParam {String}   [webinarId]
   * @apiParam {String}   [tutorId]
   * @apiParam {String}   [expiredDate]
   * @apiParam {Boolean}   [active]
   */

  router.get('/v1/lecture-sections', Middleware.hasRole('admin'), controller.list, Middleware.Response.success('list'));

  router.get('/v1/lecture-sections/:id', Middleware.isAuthenticated, controller.findOne, Middleware.Response.success('lectureSection'));

  router.post('/v1/lecture-sections', Middleware.isAuthenticated, controller.create, Middleware.Response.success('create'));

  router.put('/v1/lecture-sections/:id', Middleware.isAuthenticated, controller.findOne, controller.update, Middleware.Response.success('update'));

  router.delete('/v1/lecture-sections/:id', Middleware.isAuthenticated, controller.findOne, controller.remove, Middleware.Response.success('remove'));

  router.get('/v1/lecture-section/current', Middleware.isAuthenticated, controller.getCurrentLectureSection, Middleware.Response.success('current'));
};
