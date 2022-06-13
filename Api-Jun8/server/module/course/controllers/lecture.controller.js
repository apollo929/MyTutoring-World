const Joi = require('joi');
const moment = require('moment');
const validateSchema = Joi.object().keys({
  ordering: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  mediaIds: Joi.array().items(Joi.string()).allow([null, '']).optional(),
  courseId: Joi.string().required(),
  tutorId: Joi.string().required(),
  sectionId: Joi.string().required(),
  mediaInfo: Joi.string()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.lectureId || req.body.lectureId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const lecture = await DB.Lecture.findOne({ _id: id }).populate('tutor').populate('course');
    if (!lecture) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.lecture = lecture;
    res.locals.lecture = lecture;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const validateValue = validate.value;

    const lecture = new DB.Lecture(validate.value);
    await lecture.save();
    res.locals.create = lecture;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name'],
      equal: ['courseId', 'tutorId']
    });
    if (req.user.type === 'student' || req.user.type === 'parent') {
      return next(
        PopulateResponse.forbidden({
          message: 'You do not have access'
        })
      );
    }
    if (req.user && req.user.role !== 'admin' && req.user.type === 'tutor') {
      query.tutorId = req.user._id;
    }
    if (req.user.role !== 'admin' && !query.tutorId) {
      return next(
        PopulateResponse.error({
          message: 'Missing params'
        })
      );
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Lecture.count(query);
    let items = await DB.Lecture.find(query)
      .populate('tutor')
      .populate('course')
      .populate('media')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    res.locals.list = { count, items };
    next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const validateValue = validate.value;
    const query = { courseId: validateValue.courseId };

    const count = await DB.Lecture.count(
      Object.assign(query, {
        _id: req.lecture._id
      })
    );
    if (!count) {
      return next(
        PopulateResponse.error({
          message: 'Lecture not found'
        })
      );
    }
    Object.assign(req.lecture, validate.value);
    await req.lecture.save();
    res.locals.update = req.lecture;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.lecture.remove();
    res.locals.remove = {
      message: 'Lecture is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.getCurrentLecture = async (req, res, next) => {
  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['courseId', 'tutorId']
    });
    if (!req.user) {
      return next(
        PopulateResponse.error({
          message: 'Missing params!'
        })
      );
    }
    if (!query.tutorId) {
      query.tutorId = req.user._id;
    }
    const current = await DB.Lecture.find(query).populate('media');
    res.locals.current = current;
    return next();
  } catch (error) {
    next();
  }
};
