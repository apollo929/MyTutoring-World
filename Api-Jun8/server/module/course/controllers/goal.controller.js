const Joi = require('joi');
const moment = require('moment');
const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string().allow(['able_to', 'age', 'pre']).required(),
  courseId: Joi.string().required(),
  tutorId: Joi.string().required()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.goalId || req.body.goalId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const goal = await DB.CourseGoal.findOne({ _id: id }).populate('tutor').populate('course');
    if (!goal) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.goal = goal;
    res.locals.goal = goal;
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

    const goal = new DB.CourseGoal(validate.value);
    await goal.save();
    res.locals.create = goal;
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
    const count = await DB.CourseGoal.count(query);
    let items = await DB.CourseGoal.find(query)
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

    const count = await DB.CourseGoal.count(
      Object.assign(query, {
        _id: req.goal._id
      })
    );
    if (!count) {
      return next(
        PopulateResponse.error({
          message: 'Goal not found'
        })
      );
    }
    Object.assign(req.goal, validate.value);
    await req.goal.save();
    res.locals.update = req.goal;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.goal.remove();
    res.locals.remove = {
      message: 'Goal is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.getCurrentGoal = async (req, res, next) => {
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
    const current = await DB.CourseGoal.find(query);
    res.locals.current = current;
    return next();
  } catch (error) {
    next();
  }
};
