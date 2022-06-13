const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow([null, '']).optional(),
  idYoutube: Joi.string().required(),
  type: Joi.string().required(),
  imageId: Joi.string().required()
});

exports.findOne = async (req, res, next) => {
  try {
    const testimonial = await DB.Testimonial.findOne({ _id: req.params.testimonialId }).populate('image');
    if (!testimonial) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.testimonial = testimonial;
    res.locals.testimonial = testimonial;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new testimonial
 */
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const testimonial = new DB.Testimonial(validate.value);
    await testimonial.save();
    res.locals.testimonial = testimonial;
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

    _.merge(req.testimonial, req.body);
    await req.testimonial.save();
    res.locals.update = req.testimonial;
    return next();
  } catch (e) {
    return next();
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.testimonial.remove();
    res.locals.remove = {
      success: true,
      message: 'Testimonial is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * get list testimonial
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0;
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name', 'title']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Testimonial.count(query);
    const items = await DB.Testimonial.find(query)
      .populate('image')
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
