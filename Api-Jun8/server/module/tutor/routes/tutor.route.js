const tutorController = require('../controllers/tutor.controller');

module.exports = router => {
  /**
   * @apiDefine tutorRequest
   * @apiParam {String}   name
   * @apiParam {String}   [username]
   * @apiParam {String}   email
   * @apiParam {Boolean}   [isActive]
   * @apiParam {Boolean}   [emailVerified]
   * @apiParam {String}   [phoneNumber]
   * @apiParam {Boolean}   [phoneVerified]
   * @apiParam {String}   [address]
   * @apiParam {String}   [bio]
   * @apiParam {String[]}   [subjectIds] Array tutor id this tutor has
   * @apiParam {Boolean}   [certificatedTeacher]
   * @apiParam {String[]}   [grades] Array of grades of this tutor. allow '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'kindergarten', 'freshman', 'sophomore', 'junior', 'senior'
   * @apiParam {String[]}   [languages]
   */

  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {post} /v1/tutors  Create new tutor
   * @apiDescription Create new tutor
   * @apiUse authRequest
   * @apiUse tutorRequest
   * @apiPermission admin
   */
  router.post('/v1/tutors', Middleware.hasRole('admin'), tutorController.create, Middleware.Response.success('tutor'));

  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {put} /v1/tutors/:tutorId  Update a tutor
   * @apiDescription Update a tutor
   * @apiUse authRequest
   * @apiParam {String}   id        tutor id
   * @apiUse tutorRequest
   * @apiPermission admin
   */
  router.put(
    '/v1/tutors/:tutorId',
    Middleware.hasRole('admin'),
    tutorController.findOne,
    tutorController.update,
    Middleware.Response.success('update')
  );

  router.put(
    '/v1/tutors/:tutorId/change-status',
    Middleware.hasRole('admin'),
    tutorController.findOne,
    tutorController.changeStatus,
    Middleware.Response.success('changeStatus')
  );

  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {put} /v1/tutors/:tutorId/me  Update a tutor
   * @apiDescription Update a tutor
   * @apiUse authRequest
   * @apiParam {String}   id        tutor id
   * @apiUse tutorRequest
   * @apiPermission admin
   */
  router.put('/v1/tutors', Middleware.isAuthenticated, tutorController.update, Middleware.Response.success('update'));

  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {delete} /v1/tutors/:tutorId Remove a tutor
   * @apiDescription Remove a tutor
   * @apiUse tutorRequest
   * @apiParam {String}   id        tutor id
   * @apiPermission admin
   */
  router.delete(
    '/v1/tutors/:tutorId',
    Middleware.hasRole('admin'),
    tutorController.findOne,
    tutorController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {get} /v1/tutors/:tutorId Get tutor details
   * @apiDescription Get tutor details
   * @apiParam {String}   id        tutor id
   * @apiPermission all
   */
  router.get('/v1/tutors/:tutorId', Middleware.loadUser, tutorController.findOne, Middleware.Response.success('tutor'));

  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {get} /v1/tutors?:name&:mail&subjectId&rating  Get list tutors
   * @apiDescription Get list tutors
   * @apiParam {String}   [name]      tutor name
   * @apiParam {String}   [alias]     tutor alias
   * @apiParam {String}   [subjectId] subject wants to query. if multi subject, use comma (,)
   * @apiParam {String}   [grade] if multi subject, use comma (,)
   * @apiParam {NUmber}   [rating] number for rating filter. 1, 2, 3, 4, 5
   * @apiUse paginationQuery
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "count": 10,
   *         "items": []
   *     },
   *     "error": false
   *  }
   * @apiPermission all
   */
  router.get('/v1/tutors', Middleware.loadUser, tutorController.list, Middleware.Response.success('list'));
};
