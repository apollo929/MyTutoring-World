const Joi = require('joi');
const moment = require('moment');
const validateSchema = Joi.object().keys({
  progress: Joi.string().required(),
  courseId: Joi.string().required(),
  progressValue: Joi.string().optional(),
  watchedLecture: Joi.array().items(Joi.string()).allow([null, '']).optional()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.progressId || req.body.progressId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const progress = await DB.Progress.findOne({ _id: id }).populate('user').populate('course');
    if (!progress) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.progress = progress;
    res.locals.progress = progress;
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
    validateValue.userId = req.user._id;

    const progress = new DB.Progress(validateValue);
    await progress.save();
    res.locals.create = progress;
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
      equal: ['courseId', 'userId']
    });
    if (req.user.type !== 'admin') {
      return next(
        PopulateResponse.forbidden({
          message: 'You do not have access'
        })
      );
    }
    if (req.user.role !== 'admin') {
      return next(
        PopulateResponse.error({
          message: 'Missing params'
        })
      );
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Progress.count(query);
    let items = await DB.Progress.find(query)
      .populate('user')
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

    const count = await DB.Progress.count(
      Object.assign(query, {
        _id: req.progress._id
      })
    );
    if (!count) {
      return next(
        PopulateResponse.error({
          message: 'Progress not found'
        })
      );
    }
    Object.assign(req.progress, validate.value);
    await req.progress.save();
    res.locals.update = req.progress;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.progress.remove();
    res.locals.remove = {
      message: 'Progress is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.getCurrentProgress = async (req, res, next) => {
  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['courseId', 'userId']
    });
    if (!req.user) {
      return next(
        PopulateResponse.error({
          message: 'Missing params!'
        })
      );
    }
    if (!query.userId) {
      query.userId = req.user._id;
    }
    const current = await DB.Progress.find(query);
    res.locals.current = current;
    return next();
  } catch (error) {
    console.log(error);
    next();
  }
};
