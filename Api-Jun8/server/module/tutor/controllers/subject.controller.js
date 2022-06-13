const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  alias: Joi.string().allow([null, '']).optional(),
  description: Joi.string().allow([null, '']).optional(),
  price: Joi.number().allow([null]).optional(),
  categoryIds: Joi.array().min(1).items(Joi.string()).required(),
  isActive: Joi.boolean().allow(null, '').optional()
});

exports.findOne = async (req, res, next) => {
  try {
    const subject = await DB.Subject.findOne({ _id: req.params.subjectId }).populate('image');
    if (!subject) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.subject = subject;
    res.locals.subject = subject;
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
    const count = await DB.Subject.count({ alias });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    // eslint-disable-next-line function-paren-newline
    const subject = new DB.Subject(
      Object.assign(req.body, {
        alias
      })
      // eslint-disable-next-line function-paren-newline
    );
    await subject.save();
    res.locals.subject = subject;
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
    const count = await DB.Subject.count({
      alias,
      _id: { $ne: req.subject._id }
    });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    _.merge(req.subject, req.body);
    if (req.body.categoryIds) {
      req.subject.categoryIds = req.body.categoryIds;
    }
    await req.subject.save();
    await DB.MySubject.update(
      {
        originalSubjectId: req.subject._id
      },
      {
        $set: {
          name: validate.value.name
        }
      }
    );
    res.locals.update = req.subject;
    return next();
  } catch (e) {
    return next();
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.subject.remove();
    res.locals.remove = {
      success: true,
      message: 'Subject is deleted'
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
      text: ['name', 'alias'],
      boolean: ['isActive']
    });

    if (req.query.categoryIds) {
      const categoryIds = req.query.categoryIds.split(',');
      // console.log(categoryIds);
      query.categoryIds = { $in: categoryIds };
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Subject.count(query);
    const items = await DB.Subject.find(query)
      .populate({ path: 'categories', select: '_id name' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    //console.log(items);

    res.locals.list = {
      count,
      items
    };
    next();
  } catch (e) {
    next();
  }
};
