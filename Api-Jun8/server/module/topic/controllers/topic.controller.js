const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  alias: Joi.string().allow([null, '']).optional(),
  description: Joi.string().allow([null, '']).optional(),
  ordering: Joi.number().allow([null, '']).optional(),
  subjectIds: Joi.array().min(1).items(Joi.string()).required(),
  categoryIds: Joi.array().min(1).items(Joi.string()).required(),
  isActive: Joi.boolean().allow(null, '').optional()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.topicId || req.body.topicId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const topic = await DB.Topic.findOne({ _id: id });
    if (!topic) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.topic = topic;
    res.locals.topic = topic;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new topic
 */
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);
    const count = await DB.Topic.count({ alias });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    const topic = new DB.Topic(
      _.assign(validate.value, {
        alias
      })
    );
    await topic.save();

    res.locals.topic = topic;
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
    const count = await DB.Topic.count({
      alias,
      _id: { $ne: req.topic._id }
    });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }

    Object.assign(req.topic, validate.value);
    await req.topic.save();
    await DB.MyTopic.update(
      {
        originalTopicId: req.topic._id
      },
      {
        $set: {
          name: validate.value.name
        }
      }
    );
    res.locals.update = req.topic;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.topic.remove();

    res.locals.remove = {
      message: 'Topic is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * get list topic
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'alias', 'description'],
      boolean: ['isActive']
    });

    if (req.query.categoryIds) {
      const categoryIds = req.query.categoryIds.split(',');
      query.categoryIds = { $in: categoryIds };
    }

    if (req.query.subjectIds) {
      const subjectIds = req.query.subjectIds.split(',');
      query.subjectIds = { $in: subjectIds };
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Topic.count(query);
    let items = await DB.Topic.find(query)
      .populate({ path: 'categories', select: '_id name' })
      .populate({ path: 'subjects', select: '_id name' })
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
