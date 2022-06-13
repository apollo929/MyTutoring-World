const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  alias: Joi.string().allow([null, '']).optional(),
  ordering: Joi.number().allow([null, '']).optional(),
  description: Joi.string().allow([null, '']).optional(),
  type: Joi.string().allow(['high-school', 'middle-shool', 'elementary', 'college']).required()
});

exports.findOne = async (req, res, next) => {
  try {
    const grade = await DB.Grade.findOne({ _id: req.params.gradeId });
    if (!grade) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.grade = grade;
    res.locals.grade = grade;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new media subject
 */
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);

    const count = await DB.Grade.count({ alias });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    const grade = new DB.Grade(
      Object.assign(req.body, {
        alias
      })
    );
    await grade.save();
    res.locals.grade = grade;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * do update for user profile or admin update
 */
exports.update = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);
    const count = await DB.Grade.count({
      alias,
      _id: { $ne: req.grade._id }
    });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    _.merge(req.grade, req.body);
    await req.grade.save();
    res.locals.update = req.grade;
    return next();
  } catch (e) {
    return next();
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.grade.remove();
    res.locals.remove = {
      success: true,
      message: 'Grade is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * get list subject
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'alias']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Grade.count(query);
    const items = await DB.Grade.find(query)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = {
      count,
      items
    };
    next();
  } catch (e) {
    next();
  }
};
