const Joi = require('joi');

/**
 * change phone number of this user
 */
exports.changePhone = async (req, res, next) => {
  const schema = Joi.object().keys({
    phoneNumber: Joi.string().required()
  });

  const validate = Joi.validate(req.body, schema);
  if (validate.error) {
    return next(PopulateResponse.validationError(validate.error));
  }

  try {
    const count = await DB.User.count({
      phoneNumber: req.body.phoneNumber,
      _id: {
        $ne: req.user._id
      },
      isActive: true
    });
    if (count) {
      return next(PopulateResponse.error({
        message: 'This number has already in used.'
      }, 'ERR_PHONE_NUMBER_IN_USED'));
    }

    const code = Helper.String.randomString(5);
    let phoneVerify = await DB.PhoneVerify.findOne({
      phoneNumber: req.body.phoneNumber
    });
    if (!phoneVerify) {
      phoneVerify = new DB.PhoneVerify({
        userId: req.user._id,
        phoneNumber: req.body.phoneNumber
      });
    }
    phoneVerify.code = code;
    await phoneVerify.save();
    // TODO - send phone verify code to user

    res.locals.changePhone = PopulateResponse.createSuccess({
      message: 'A verify code has been sent to your phone number',
      code // TODO - remove in prod
    });
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * verify user phone number
 */
exports.verifyPhone = async (req, res, next) => {
  const schema = Joi.object().keys({
    phoneNumber: Joi.string().required(),
    code: Joi.string.require()
  });

  const validate = Joi.validate(req.body, schema);
  if (validate.error) {
    return next(PopulateResponse.validationError(validate.error));
  }

  try {
    const phoneVerify = await DB.PhoneVerify.findOne({
      code: req.body.code,
      phoneNumber: req.body.phoneNumber
    });
    if (!phoneVerify) {
      return next(PopulateResponse.notFound({
        message: 'This number is not found.'
      }));
    }

    await DB.User.update({
      _id: phoneVerify.userId
    }, {
      $set: {
        phoneNumber: phoneVerify.phoneNumber,
        phoneVerified: true
      }
    });
    await phoneVerify.remove();
    res.locals.verifyPhone = PopulateResponse.updateSuccess({
      message: 'Your phone number has been verified',
      success: true
    });

    return next();
  } catch (e) {
    return next(e);
  }
};
