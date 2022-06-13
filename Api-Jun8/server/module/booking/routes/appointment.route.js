const appointmentController = require('../controllers/appointment.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const documentDir = 'public/documents/';

if (!fs.existsSync(documentDir)) {
  mkdirp.sync(documentDir);
}

const uploadDocument = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, documentDir);
    },
    filename(req, file, cb) {
      const ext = Helper.String.getExt(file.originalname);
      const nameWithoutExt = Helper.String.createAlias(Helper.String.getFileName(file.originalname, true));
      let fileName = `${nameWithoutExt}${ext}`;
      if (fs.existsSync(path.resolve(documentDir, fileName))) {
        fileName = `${nameWithoutExt}-${Helper.String.randomString(5)}${ext}`;
      }

      cb(null, fileName);
    },
    fileSize: (process.env.MAX_PHOTO_SIZE || 10) * 1024 * 1024 // 10MB limit
  })
});

module.exports = router => {
  /**
   * @apiGroup Appointment
   * @apiVersion 1.0.0
   * @api {get} /v1/appointments?:status&:tutorId&:userId&startTime&toTime Listing
   * @apiParam {String}   [status]  `pending`, `canceled`, `processing`, `completed`
   * @apiParam {String}   [tutorId]
   * @apiParam {String}   [userId]
   * @apiParam {Date}   [startTime]
   * @apiParam {Date}   [toTime]
   * @apiUse paginationQuery
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "count": 10,
   *         "items": [
   *            {
   *               "_id": "....",
   *               "status": "pending"
   *            }
   *          ]
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.get('/v1/appointments', Middleware.isAuthenticated, appointmentController.list, Middleware.Response.success('list'));

  /**
   * @apiGroup Appointment
   * @apiVersion 1.0.0
   * @api {get} /v1/appointments/tutors/:tutorId?:status&&:userId&startTime&toTime Listing appoint tutor
   * @apiParam {String}   [status]  `pending`, `canceled`, `processing`, `completed`
   * @apiParam {String}   [userId]
   * @apiParam {Date}   [startTime]
   * @apiParam {Date}   [toTime]
   * @apiUse paginationQuery
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "count": 10,
   *         "items": [
   *            {
   *               "startTime": "....",
   *               "toTime": "....",
   *               "status": "pending"
   *            }
   *          ]
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.get(
    '/v1/appointments/tutors/:tutorId',
    Middleware.loadUser,
    appointmentController.tutorAppointmentTime,
    Middleware.Response.success('list')
  );

  /**
   * @apiGroup Appointment
   * @apiVersion 1.0.0
   * @api {post} /v1/appointments/:appointmentId/cancel Cancel
   * @apiParam {String}   appointmentId
   * @apiParam {String}   [reason]  cancel reason
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "_id": "5b99efc048d35953fbd9e93f",
   *         "status": "canceled",
   *         "cancelReason": "some text"
   *     },
   *     "error": false
   *  }
   * @apiPermission admin
   */
  router.post(
    '/v1/appointments/:appointmentId/cancel',
    Middleware.hasRole('admin'),
    appointmentController.cancel,
    Middleware.Response.success('cancel')
  );

  /**
   * @apiGroup Appointment
   * @apiVersion 1.0.0
   * @api {post} /v1/appointments/student/:appointmentId/cancel Cancel
   * @apiParam {String}   appointmentId
   * @apiParam {String}   [reason]  cancel reason
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "_id": "5b99efc048d35953fbd9e93f",
   *         "status": "canceled",
   *         "cancelReason": "some text"
   *     },
   *     "error": false
   *  }
   * @apiPermission admin
   */
  router.post(
    '/v1/appointments/student/:appointmentId/cancel',
    Middleware.isAuthenticated,
    appointmentController.studentCancel,
    Middleware.Response.success('studentCancel')
  );

  /**
   * @apiGroup Appointment
   * @apiVersion 1.0.0
   * @api {post} /v1/appointments/tutor/:appointmentId/cancel Cancel
   * @apiParam {String}   appointmentId
   * @apiParam {String}   [reason]  cancel reason
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *         "_id": "5b99efc048d35953fbd9e93f",
   *         "status": "canceled",
   *         "cancelReason": "some text"
   *     },
   *     "error": false
   *  }
   * @apiPermission admin
   */
  router.post(
    '/v1/appointments/tutor/:appointmentId/cancel',
    Middleware.isAuthenticated,
    appointmentController.tutorCancel,
    Middleware.Response.success('tutorCancel')
  );

  /**
   * @apiGroup Appointment
   * @apiVersion 1.0.0
   * @api {get} /v1/appointments/:appointmentId Details
   * @apiParam {String}   appointmentId
   * @apiSuccessExample {json} Success-Response:
   *  {
   *     "code": 200,
   *     "message": "OK",
   *     "data": {
   *        "_id": "5b99efc048d35953fbd9e93f",
   *        "status": "pending",
   *        "tutor": {},
   *        "user": {}
   *     },
   *     "error": false
   *  }
   * @apiPermission user
   */
  router.get(
    '/v1/appointments/:appointmentId',
    Middleware.isAuthenticated,
    appointmentController.findOne,
    Middleware.Response.success('appointment')
  );

  router.put(
    '/v1/appointments/:appointmentId/update-document',
    Middleware.isAuthenticated,
    appointmentController.updateDocument,
    Middleware.Response.success('updateDocument')
  );

  router.post(
    '/v1/appointments/:appointmentId/upload-document',
    Middleware.isAuthenticated,
    appointmentController.findOne,
    uploadDocument.single('file'),
    appointmentController.uploadDocument,
    Middleware.Response.success('upload')
  );

  router.put(
    '/v1/appointments/:id/reSchedule',
    Middleware.isAuthenticated,
    appointmentController.reSchedule,
    Middleware.Response.success('reSchedule')
  );

  router.post(
    '/v1/appointments/:appointmentId/canReschedule',
    Middleware.isAuthenticated,
    appointmentController.findOne,
    appointmentController.canReschedule,
    Middleware.Response.success('canReschedule')
  );

  router.post(
    '/v1/appointments/:appointmentId/reviewStudent',
    Middleware.isAuthenticated,
    appointmentController.reviewStudent,
    Middleware.Response.success('review')
  );
};
