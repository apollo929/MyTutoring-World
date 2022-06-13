const Joi = require('joi');
const moment = require('moment');

exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      startTime: Joi.string().required(),
      toTime: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const data = await Service.AvailableTime.create(req.user._id, validate.value);
    res.locals.create = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await DB.AvailableTime.findOne({ _id: req.params.availableTimeId });
    if (!item) {
      return next(PopulateResponse.notFound());
    }
    if (req.user.role !== 'admin' && item.userId.toString() !== req.user._id.toString()) {
      return next(PopulateResponse.forbidden());
    }

    await item.remove();
    res.locals.remove = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    if (!req.user && !req.query.userId) {
      return next(PopulateResponse.error({
        message: 'Missing userId in the query'
      }));
    }

    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['userId']
    });

    if (!req.query.userId && req.user) {
      query.userId = req.user._id;
    }

    if (req.query.startTime && req.query.toTime) {
      query.startTime = {
        $gte: moment(req.query.startTime).toDate(),
        $lte: moment(req.query.toTime).toDate()
      };
    }

    const sort = {
      startTime: 1
    };
    const count = await DB.AvailableTime.count(query);
    const items = await DB.AvailableTime.find(query)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = {
      count,
      items
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      startTime: Joi.string().required(),
      toTime: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    //Find Available Time with availableTimeId
    const availableTime = await DB.AvailableTime.findOne({ _id: req.params.availableTimeId });
    if (!availableTime) {
      return next(PopulateResponse.notFound());
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== availableTime.userId.toString()) {
      return next(PopulateResponse.forbidden());
    }

    const result = await Service.AvailableTime.update(availableTime, validate.value);
    res.locals.update = result;
    return next();
  } catch (e) {
    return next(e);
  }
};
