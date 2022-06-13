const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('../../media/config');
const registerController = require('../controllers/register.controller');

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

const uploadVideo = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, config.videoDir);
    },
    filename(req, file, cb) {
      const ext = Helper.String.getExt(file.originalname);
      const nameWithoutExt = Helper.String.createAlias(Helper.String.getFileName(file.originalname, true));
      let fileName = `${nameWithoutExt}${ext}`;
      if (fs.existsSync(path.resolve(config.videoDir, fileName))) {
        fileName = `${nameWithoutExt}-${Helper.String.randomString(5)}${ext}`;
      }

      cb(null, fileName);
    },
    fileSize: (process.env.MAX_VIDEO_SIZE || 10) * 1024 * 1024 // 10MB limit
  })
});

const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, config.avatarDir);
    },
    filename(req, file, cb) {
      const ext = Helper.String.getExt(file.originalname);
      const nameWithoutExt = Helper.String.createAlias(Helper.String.getFileName(file.originalname, true));
      let fileName = `${nameWithoutExt}${ext}`;
      if (fs.existsSync(path.resolve(config.avatarDir, fileName))) {
        fileName = `${nameWithoutExt}-${Helper.String.randomString(5)}${ext}`;
      }

      cb(null, fileName);
    },
    fileSize: (process.env.MAX_VIDEO_SIZE || 10) * 1024 * 1024 // 10MB limit
  })
});

module.exports = router => {
  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {post} /v1/tutors/register register Participant
   * @apiDescription Register new participant account
   * @apiParam {String}   email      email address
   * @apiParam {String}   password   password
   * @apiParam {String}   [phoneNumber]  phone number
   * @apiParam {String}   [name] user name
   * @apiParam {String}   issueDocument File id for verification document
   * @apiSuccessExample {json} Success-Response:
   *  {
   *      "code": 200,
   *       "message": "OK",
   *      "data": {
   *           "message": "Your account has been created, please verify your email address and get access."
   *       },
   *       "error": false
   *  }
   * @apiPermission all
   */
  router.post(
    '/v1/tutors/register',
    // uploadDocument.single('file'),
    registerController.register,
    Middleware.Response.success('register')
  );

  router.post('/v1/tutors/upload-document', uploadDocument.single('file'), registerController.uploadDocument, Middleware.Response.success('upload'));

  router.post('/v1/tutors/upload-introVideo', uploadVideo.single('file'), registerController.uploadIntroVideo, Middleware.Response.success('upload'));
  
  router.post('/v1/tutors/upload-introImage', uploadAvatar.single('file'), registerController.uploadIntroImage, Middleware.Response.success('upload'));
  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {post} /v1/tutors/:tutorId/reject Reject
   * @apiParam {String}   tutorId
   * @apiParam {String}   [reason] Reason
   * @apiSuccessExample {json} Success-Response:
   *  {
   *      "code": 200,
   *       "message": "OK",
   *      "data": {
   *           "success": true
   *       },
   *       "error": false
   *  }
   * @apiPermission all
   */
  router.post('/v1/tutors/:tutorId/reject', Middleware.hasRole('admin'), registerController.reject, Middleware.Response.success('reject'));

  /**
   * @apiGroup Tutor
   * @apiVersion 1.0.0
   * @api {post} /v1/tutors/:tutorId/approve Approve
   * @apiParam {String}   tutorId
   * @apiSuccessExample {json} Success-Response:
   *  {
   *      "code": 200,
   *       "message": "OK",
   *      "data": {
   *           "success": true
   *       },
   *       "error": false
   *  }
   * @apiPermission all
   */
  router.post('/v1/tutors/:tutorId/approve', Middleware.hasRole('admin'), registerController.approve, Middleware.Response.success('approve'));
};
