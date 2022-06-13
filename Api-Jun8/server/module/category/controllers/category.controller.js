const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  alias: Joi.string().allow([null, '']).optional(),
  description: Joi.string().allow([null, '']).optional(),
  ordering: Joi.number().allow([null, '']).optional(),
  imageId: Joi.string().required(),
  isActive: Joi.boolean().allow(null, '').optional()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.categoryId || req.body.categoryId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const category = await DB.Category.findOne({ _id: id }).populate('image');
    if (!category) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.category = category;
    res.locals.category = category;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new category
 */
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);
    const count = await DB.Category.count({ alias });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    const category = new DB.Category(
      _.assign(validate.value, {
        alias
      })
    );
    await category.save();

    res.locals.category = category;
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

    let alias = validate.value.alias ? Helper.String.createAlias(validate.value.alias) : Helper.String.createAlias(validate.value.name);
    const count = await DB.Category.count({
      alias,
      _id: { $ne: req.category._id }
    });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    Object.assign(req.category, validate.value);
    await req.category.save();
    await DB.MyCategory.update(
      {
        originalCategoryId: req.category._id
      },
      {
        $set: {
          name: validate.value.name
        }
      }
    );
    res.locals.update = req.category;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.category.remove();

    res.locals.remove = {
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
      text: ['name', 'alias', 'description'],
      boolean: ['isActive']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Category.count(query);
    let items = await DB.Category.find(query)
      .populate('image')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = { count, items };
    next();
  } catch (e) {
    next(e);
  }
};
