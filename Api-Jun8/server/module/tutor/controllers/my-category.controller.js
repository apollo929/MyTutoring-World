const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  originalCategoryId: Joi.string().required(),
  isActive: Joi.boolean().allow(null, '').optional(),
  tutorId: Joi.string().allow([null, '']).optional()
});

exports.findOne = async (req, res, next) => {
  try {
    const myCategory = await DB.MyCategory.findOne({ _id: req.params.id });
    if (!myCategory) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.myCategory = myCategory;
    res.locals.category = myCategory;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new media category
 */
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const category = await DB.Category.findOne({ _id: validate.value.originalCategoryId });
    if (!category) {
      return next(PopulateResponse.notFound({ message: 'Category not found' }));
    }
    const tutorId = req.user.role === 'admin' && req.body.tutorId ? req.body.tutorId : req.user._id;
    let myCategory = await DB.MyCategory.findOne({ originalCategoryId: validate.value.originalCategoryId, tutorId: tutorId });
    if (myCategory) {
      return next(PopulateResponse.error({ message: 'The category you selected is duplicated!' }));
    }
    // eslint-disable-next-line function-paren-newline
    myCategory = new DB.MyCategory(
      Object.assign(req.body, {
        alias: category.alias,
        name: category.name,
        tutorId: tutorId
      })
      // eslint-disable-next-line function-paren-newline
    );
    await myCategory.save();
    await DB.User.update(
      {
        _id: tutorId
      },
      {
        $addToSet: {
          categoryIds: {
            $each: [category._id]
          }
        }
      }
    );
    res.locals.category = myCategory;
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
    _.merge(req.myCategory, req.body);
    await req.myCategory.save();
    res.locals.update = req.myCategory;
    return next();
  } catch (e) {
    return next();
  }
};

exports.remove = async (req, res, next) => {
  try {
    const appointments = await DB.Appointment.count({
      paid: true,
      categoryId: req.myCategory._id,
      status: { $nin: ['canceled', 'not-start'] }
    });
    if (appointments) {
      return next(
        PopulateResponse.error({
          message: 'Can not delete, already have users enroll this category'
        })
      );
    }
    await req.myCategory.remove();
    await DB.User.update(
      {
        _id: req.myCategory.tutorId
      },
      {
        $pull: {
          categoryIds: { $in: [req.myCategory.originalCategoryId] }
        }
      }
    );
    res.locals.remove = {
      success: true,
      message: 'Category is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * get list category
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'alias'],
      boolean: ['isActive']
    });
    if (!req.query.tutorId) {
      return next(
        PopulateResponse.error({
          message: 'Missing params'
        })
      );
    }
    query.tutorId = req.query.tutorId;
    query.isActive = true;
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.MyCategory.count(query);
    const items = await DB.MyCategory.find(query)
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

exports.listOfMe = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'alias'],
      boolean: ['isActive']
    });
    query.tutorId = req.user._id;
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.MyCategory.count(query);
    const items = await DB.MyCategory.find(query)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.listOfMe = {
      count,
      items
    };
    next();
  } catch (e) {
    next();
  }
};
