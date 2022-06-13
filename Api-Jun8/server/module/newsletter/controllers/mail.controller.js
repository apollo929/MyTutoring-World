const Joi = require('joi');

exports.sendEmail = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      subject: Joi.string().required(),
      content: Joi.string().allow([null, '']).optional(),
      userType: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    await Service.Newsletter.sendMail(validate.value);
    res.locals.sendEmail = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.inviteFriends = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      email: Joi.string().email().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const appName = process.env.APP_NAME;

    await Service.Mailer.send('newsletter/invite-friend.html', validate.value.email, {
      subject: `${req.user.name} invites you to join ${appName}`,
      user: req.user.getPublicProfile(),
      appName
    });
    res.locals.inviteFriends = { success: true };
    return next();
  } catch (error) {
    return next(error);
  }
};
