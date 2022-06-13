const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('./config');

const uploadPhoto = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, config.photoDir);
    },
    filename(req, file, cb) {
      const ext = Helper.String.getExt(file.originalname);
      const nameWithoutExt = Helper.String.createAlias(Helper.String.getFileName(file.originalname, true));
      let fileName = `${nameWithoutExt}${ext}`;
      if (fs.existsSync(path.resolve(config.photoDir, fileName))) {
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

const uploadFile = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, config.fileDir);
    },
    filename(req, file, cb) {
      const ext = Helper.String.getExt(file.originalname);
      const nameWithoutExt = Helper.String.createAlias(Helper.String.getFileName(file.originalname, true));
      let fileName = `${nameWithoutExt}${ext}`;
      if (fs.existsSync(path.resolve(config.fileDir, fileName))) {
        fileName = `${nameWithoutExt}-${Helper.String.randomString(5)}${ext}`;
      }

      cb(null, fileName);
    },
    fileSize: (process.env.MAX_FILE_SIZE || 10) * 1024 * 1024 // 10MB limit
  })
});

const uploadAudio = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, config.audioDir);
    },
    filename(req, file, cb) {
      const ext = Helper.String.getExt(file.originalname);
      const nameWithoutExt = Helper.String.createAlias(Helper.String.getFileName(file.originalname, true));
      let fileName = `${nameWithoutExt}${ext}`;
      if (fs.existsSync(path.resolve(config.audioDir, fileName))) {
        fileName = `${nameWithoutExt}-${Helper.String.randomString(5)}${ext}`;
      }

      cb(null, fileName);
    },
    fileSize: (process.env.MAX_AUDIO_SIZE || 10) * 1024 * 1024 // 10MB limit
  })
});

// the queue
require('./queue');

const categoryController = require('./controllers/category.controller');
const photoController = require('./controllers/photo.controller');
const videoController = require('./controllers/video.controller');
const mediaController = require('./controllers/media.controller');
const audioController = require('./controllers/audio.controller');

exports.model = {
  Media: require('./models/media'),
  MediaCategory: require('./models/category')
};

exports.services = {
  S3: require('./services/s3'),
  Media: require('./services/Media')
};

exports.router = router => {
  /**
   * @apiDefine mediaCategoryRequest
   * @apiParam {String}   name        Category name
   * @apiParam {String}   [alias]     Alias name. Or will be generated from name automatically
   * @apiParam {String}   [description]
   * @apiParam {Number}   [ordering]
   */

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {get} /v1/media/categories?:name&:alias  Get list categories
   * @apiDescription Get list categories
   * @apiParam {String}   [name]      category name
   * @apiParam {String}   [alias]     category alias
   * @apiPermission all
   */
  router.get('/v1/media/categories', categoryController.search, Middleware.Response.success('search'));

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {post} /v1/media/categories  Create new category
   * @apiDescription Create new category
   * @apiUse authRequest
   * @apiUse mediaCategoryRequest
   * @apiPermission superadmin
   */
  router.post(
    '/v1/media/categories',
    Middleware.hasRole('admin'),
    categoryController.create,
    Middleware.Response.success('mediaCategory')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {put} /v1/media/categories/:id  Update a category
   * @apiDescription Update a category
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiUse mediaCategoryRequest
   * @apiPermission superadmin
   */
  router.put(
    '/v1/media/categories/:id',
    Middleware.hasRole('admin'),
    categoryController.findOne,
    categoryController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {delete} /v1/media/categories/:id Remove a category
   * @apiDescription Remove a category
   * @apiUse authRequest
   * @apiParam {String}   id        Category id
   * @apiPermission superadmin
   */
  router.delete(
    '/v1/media/categories/:id',
    Middleware.hasRole('admin'),
    categoryController.findOne,
    categoryController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {get} /v1/media/categories/:id Get category details
   * @apiDescription Get category details
   * @apiParam {String}   id        Category id
   * @apiPermission all
   */
  router.get('/v1/media/categories/:id', categoryController.findOne, Middleware.Response.success('mediaCategory'));

  /**
   * @apiDefine photoRequest
   * @apiParam {Object}   file  file data
   * @apiParam {String}   [name] file name. Otherwiwse it is
   * @apiParam {String}   [description] photo description
   * @apiParam {String}   [description]
   * @apiParam {String[]} [categoryIds] categories which this photo belongs to
   */

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {post} /v1/media/photos  Upload a photo
   * @apiDescription Upload a photo. Use multipart/form-data to upload file and add additional fields
   * @apiUse authRequest
   * @apiUse photoRequest
   * @apiPermission user
   */
  router.post(
    '/v1/media/photos',
    Middleware.isAuthenticated,
    uploadPhoto.single('file'),
    photoController.base64Upload,
    photoController.upload,
    Middleware.Response.success('photo')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {post} /v1/media/videos  Upload a video
   * @apiDescription Upload a video. Use multipart/form-data to upload file and add additional fields
   * @apiUse authRequest
   * @apiUse photoRequest
   * @apiPermission user
   */
  router.post(
    '/v1/media/videos',
    Middleware.isAuthenticated,
    uploadVideo.single('file'),
    videoController.upload,
    Middleware.Response.success('video')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {post} /v1/media/audios  Upload a audio
   * @apiDescription Upload a audio. Use multipart/form-data to upload file and add additional fields
   * @apiUse authRequest
   * @apiUse audioRequest
   * @apiPermission user
   */
  router.post(
    '/v1/media/audios',
    Middleware.isAuthenticated,
    uploadAudio.single('file'),
    audioController.upload,
    Middleware.Response.success('audio')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {post} /v1/media/files  Upload a file
   * @apiDescription Upload a file. Use multipart/form-data to upload file and add additional fields
   * @apiUse authRequest
   * @apiUse photoRequest
   * @apiPermission user
   */
  router.post(
    '/v1/media/files',
    Middleware.isAuthenticated,
    uploadFile.single('file'),
    mediaController.uploadFile,
    Middleware.Response.success('file')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {get} /v1/media/search?:page&:take&:name&:type&:sort&:sortType Get list media
   * @apiDescription Get list media
   * @apiParam {Number}   [page="1"]
   * @apiParam {Number}   [take="10"]
   * @apiParam {String}   [name]
   * @apiParam {String}   [type] `video`, `photo`...
   * @apiParam {Sring}   [sort="createdAt"]
   * @apiParam {Sring}   [sortType="desc"]
   * @apiPermission user
   */
  router.get(
    '/v1/media/search',
    Middleware.isAuthenticated,
    mediaController.search,
    Middleware.Response.success('search')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {get} /v1/media/:id Get media
   * @apiDescription Get a media detail
   * @apiParam {String}   id        media id
   * @apiPermission all
   */
  router.get('/v1/media/:id', mediaController.findOne, Middleware.Response.success('media'));

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {get} /v1/media/:id Get photo detail
   * @apiDescription Get a video detail
   * @apiParam {String}   id        photo id
   * @apiPermission all
   */
  router.get('/v1/media/photos/:id', mediaController.findOne, Middleware.Response.success('media'));

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {get} /v1/media/:id Get video detail
   * @apiDescription Get a video detail
   * @apiParam {String}   id        video id
   * @apiPermission all
   */
  router.get('/v1/media/videos/:id', mediaController.findOne, Middleware.Response.success('media'));

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {get} /v1/media/:id Get audio detail
   * @apiDescription Get a audio detail
   * @apiParam {String}   id        audio id
   * @apiPermission all
   */
  router.get('/v1/media/audios/:id', mediaController.findOne, Middleware.Response.success('media'));

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {delete} /v1/media/photos/:id Remove a photo
   * @apiDescription Remove a photo
   * @apiUse authRequest
   * @apiParam {String}   id        photo id
   * @apiPermission user
   */
  router.delete(
    '/v1/media/photos/:id',
    Middleware.isAuthenticated,
    mediaController.findOne,
    mediaController.validatePermission,
    mediaController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {delete} /v1/media/videos/:id Remove a video
   * @apiDescription Remove a video
   * @apiUse authRequest
   * @apiParam {String}   id        video id
   * @apiPermission user
   */
  router.delete(
    '/v1/media/videos/:id',
    Middleware.isAuthenticated,
    mediaController.findOne,
    mediaController.validatePermission,
    mediaController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {delete} /v1/media/audios/:id Remove a audio
   * @apiDescription Remove a audio
   * @apiUse authRequest
   * @apiParam {String}   id        audio id
   * @apiPermission user
   */
  router.delete(
    '/v1/media/audios/:id',
    Middleware.isAuthenticated,
    mediaController.findOne,
    mediaController.validatePermission,
    mediaController.remove,
    Middleware.Response.success('remove')
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {delete} /v1/media/:id Remove a media
   * @apiDescription Remove a media
   * @apiUse authRequest
   * @apiParam {String}   id        media id
   * @apiPermission user
   */
  router.delete(
    '/v1/media/:id',
    Middleware.isAuthenticated,
    mediaController.findOne,
    mediaController.validatePermission,
    mediaController.remove,
    Middleware.Response.success(PopulateResponse.deleteSuccess())
  );

  /**
   * @apiGroup Media
   * @apiVersion 1.0.0
   * @api {put} /v1/media/:id Update a media
   * @apiDescription Update a media
   * @apiUse authRequest
   * @apiParam {String}   id        media id
   * @apiParam {String}   name        media name
   * @apiParam {String}   description        media description
   * @apiParam {String[]}   categoryIds        media category
   * @apiPermission user
   */
  router.put(
    '/v1/media/:id',
    Middleware.isAuthenticated,
    mediaController.findOne,
    mediaController.validatePermission,
    mediaController.update,
    Middleware.Response.success('update')
  );
};
