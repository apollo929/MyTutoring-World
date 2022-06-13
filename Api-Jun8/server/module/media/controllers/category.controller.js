const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  alias: Joi.string().allow([null, '']).optional(),
  description: Joi.string().allow([null, '']).optional(),
  ordering: Joi.number().allow([null, '']).optional()
}).unknown();

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.mediaCategoryId || req.body.mediaCategoryId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const category = await DB.MediaCategory.findOne({ _id: id });
    if (!category) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.mediaCategory = category;
    res.locals.mediaCategory = category;
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

    let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);
    const count = await DB.MediaCategory.count({ alias });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    const category = new DB.MediaCategory(Object.assign(req.body, {
      alias
    }));
    await category.save();
    res.locals.mediaCategory = category;
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
    const count = await DB.MediaCategory.count({
      alias,
      _id: { $ne: req.mediaCategory._id }
    });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    _.merge(req.mediaCategory, req.body);
    await req.mediaCategory.save();
    res.locals.update = req.mediaCategory;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.mediaCategory.remove();
    await DB.Media.updateMany({
      categoryIds: {
        $in: [req.mediaCategory._id]
      }
    }, {
      $pull: {
        categoryIds: req.mediaCategory._id
      }
    });

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
exports.search = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'alias']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.MediaCategory.count(query);
    const items = await DB.MediaCategory.find(query)
      .collation({ locale: 'en' })
      .sort(sort).skip(page * take)
      .limit(take)
      .exec();

    res.locals.search = {
      count,
      items
    };
    next();
  } catch (e) {
    next(e);
  }
};
