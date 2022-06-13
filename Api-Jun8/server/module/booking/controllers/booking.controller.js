const Joi = require('joi');

exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      startTime: Joi.string().required(),
      toTime: Joi.string().required(),
      targetId: Joi.string().required(),
      tutorId: Joi.string().required(),
      isFree: Joi.boolean().allow([null]).optional(),
      redirectSuccessUrl: Joi.string().optional(),
      cancelUrl: Joi.string().optional(),
      emailCustomer: Joi.string().email().allow([null, '']).optional(),
      couponCode: Joi.string().allow([null, '']).optional()
      // displayStartTime: Joi.string().required(),
      // displayToTime: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const slot = await DB.Schedule.findOne({
      startTime: validate.value.startTime,
      toTime: validate.value.toTime,
      tutorId: validate.value.tutorId
    });
    const data = await Service.Booking.create(
      Object.assign(
        {
          userId: req.user._id,
          targetType: 'subject',
          displayStartTime: slot.displayStartTime,
          displayToTime: slot.displayToTime
        },
        validate.value
      )
    );
    res.locals.create = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.checkFreeBooking = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      tutorId: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const canBookFree = await Service.Booking.canBookFree(req.user._id);
    const canBookFreeWithTutor = await Service.Booking.canBookFreeWithTutor(
      Object.assign(
        {
          userId: req.user._id
        },
        validate.value
      )
    );
    res.locals.check = {
      canBookFree,
      canBookFreeWithTutor
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.checkOverlapSlot = async (req, res, next) => {
  try {
    const options = {
      userId: req.user._id,
      startTime: req.body.startTime,
      toTime: req.body.toTime
    };
    const checkOverlap = await Service.Booking.checkOverlapSlot(options);

    res.locals.checkOverlap = {
      checkOverlap
    };
    return next();
  } catch (e) {
    next(e);
  }
};
