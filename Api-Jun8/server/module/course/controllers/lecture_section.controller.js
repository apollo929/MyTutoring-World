const Joi = require('joi');
const moment = require('moment');
const validateSchema = Joi.object().keys({
  ordering: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  courseId: Joi.string().required(),
  tutorId: Joi.string().required()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.lectureSectionId || req.body.lectureSectionId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const lectureSection = await DB.LectureSection.findOne({ _id: id }).populate('tutor').populate('course');
    if (!lectureSection) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.lectureSection = lectureSection;
    res.locals.lectureSection = lectureSection;
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

    const lectureSection = new DB.LectureSection(validate.value);
    await lectureSection.save();
    res.locals.create = lectureSection;
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
    const count = await DB.LectureSection.count(query);
    let items = await DB.LectureSection.find(query)
      .populate('tutor')
      .populate('course')
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

    const count = await DB.LectureSection.count(
      Object.assign(query, {
        _id: req.lectureSection._id
      })
    );
    if (!count) {
      return next(
        PopulateResponse.error({
          message: 'Section not found'
        })
      );
    }
    Object.assign(req.lectureSection, validate.value);
    await req.lectureSection.save();
    res.locals.update = req.lectureSection;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.lectureSection.remove();
    res.locals.remove = {
      message: 'Section is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.getCurrentLectureSection = async (req, res, next) => {
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
    const current = await DB.LectureSection.find(query);
    res.locals.current = current;
    return next();
  } catch (error) {
    next();
  }
};
