const Joi = require('joi');
const moment = require('moment');
const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  code: Joi.string().required(),
  type: Joi.string().allow(['percent', 'money']).required(),
  value: Joi.number().optional(),
  targetType: Joi.string().required(),
  webinarId: Joi.string().allow([null, '']).when('targetType', {
    is: 'webinar',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  courseId: Joi.string().allow([null, '']).when('targetType', {
    is: 'course',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  tutorId: Joi.string().required(),
  expiredDate: Joi.string().optional(),
  active: Joi.boolean().allow(null).optional(),
  startTime: Joi.string().required(),
  limitNumberOfUse: Joi.number().optional()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.couponId || req.body.couponId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const coupon = await DB.Coupon.findOne({ _id: id }).populate('tutor').populate('webinar').populate('course');
    if (!coupon) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.coupon = coupon;
    res.locals.coupon = coupon;
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
    const query =
      validateValue.targetType === 'webinar'
        ? { webinarId: validateValue.webinarId, targetType: validateValue.targetType }
        : validateValue.targetType === 'course'
        ? { courseId: validateValue.courseId, targetType: validateValue.targetType }
        : { tutorId: validateValue.tutorId, targetType: validateValue.targetType };
    const count = await DB.Coupon.count(query);
    if (count) {
      return next(
        PopulateResponse.error({
          message: 'The target has a discount'
        })
      );
    }
    const coupon = new DB.Coupon(validate.value);
    await coupon.save();
    if (validateValue.targetType === 'webinar') {
      await DB.Webinar.update(
        { _id: validate.value.webinarId },
        {
          $set: { couponId: coupon._id }
        }
      );
    }
    res.locals.create = coupon;
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
      equal: ['webinarId', 'tutorId', 'targetType']
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
    if (req.user.role !== 'admin' && (!query.targetType || !query.tutorId)) {
      return next(
        PopulateResponse.error({
          message: 'Missing params'
        })
      );
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Coupon.count(query);
    let items = await DB.Coupon.find(query)
      .populate('tutor')
      .populate('webinar')
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
    const query =
      validateValue.targetType === 'webinar'
        ? { webinarId: validateValue.webinarId, targetType: validateValue.targetType }
        : validateValue.targetType === 'course'
        ? { courseId: validateValue.courseId, targetType: validateValue.targetType }
        : { tutorId: validateValue.tutorId, targetType: validateValue.targetType };
    const count = await DB.Coupon.count(
      Object.assign(query, {
        _id: req.coupon._id
      })
    );
    if (!count) {
      return next(
        PopulateResponse.error({
          message: 'Coupon not found'
        })
      );
    }
    Object.assign(req.coupon, validate.value);
    await req.coupon.save();
    if (validateValue.targetType === 'webinar') {
      await DB.Webinar.update(
        { _id: validate.value.webinarId },
        {
          $set: { couponId: req.coupon._id }
        }
      );
    }
    res.locals.update = req.coupon;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.coupon.remove();
    res.locals.remove = {
      message: 'Coupon is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.isUsedCoupon = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.couponId || req.body.couponId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const used = await Service.Coupon.isUsedCoupon({
      userId: req.user._id,
      couponId: id
    });

    res.locals.isUsedCoupon = {
      used: used
    };
    return next();
  } catch (e) {
    next(e);
  }
};

exports.getCurrentCoupon = async (req, res, next) => {
  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['webinarId', 'targetType', 'tutorId']
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
    const current = await DB.Coupon.findOne(query);
    res.locals.current = current;
    return next();
  } catch (error) {
    next();
  }
};

exports.applyCoupon = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      code: Joi.string().required(),
      targetType: Joi.string().required(),
      webinarId: Joi.string().allow([null, '']).when('targetType', {
        is: 'webinar',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      tutorId: Joi.string().allow([null, '']).when('targetType', {
        is: 'subject',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      courseId: Joi.string().allow([null, '']).when('targetType', {
        is: 'course',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
    });

    const validate = Joi.validate(req.query, schema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['webinarId', 'targetType', 'code', 'tutorId']
    });
    const coupon = await DB.Coupon.findOne(query);
    if (!coupon) {
      return res.status(404).send(
        PopulateResponse.notFound({
          message: 'Coupon not found'
        })
      );
    }
    const count = await DB.Transaction.count({
      couponCode: coupon.code,
      paid: true
    });

    if (count >= coupon.limitNumberOfUse) {
      return next(
        PopulateResponse.error({
          message: 'Coupon has expired'
        })
      );
    }
    if (moment().isAfter(moment(coupon.expiredDate)) || moment().isBefore(moment(coupon.startTime))) {
      return next(
        PopulateResponse.error({
          message: 'Coupon has expired'
        })
      );
    }
    res.locals.apply = {
      canApply: true
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
