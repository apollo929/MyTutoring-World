const Joi = require('joi');

exports.connectFacebook = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      accessToken: Joi.string().required()
    });

    const validate = Joi.validate(req.body, schema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const data = await Service.SocialConnect.Facebook.getProfile(validate.value.accessToken);
    let social = await DB.UserSocial.findOne({
      userId: req.user._id,
      socialId: data.id,
      social: 'facebook'
    });
    if (!social) {
      social = new DB.UserSocial({
        userId: req.user._id,
        social: 'facebook',
        socialId: data.id
      });
    }
    social.accessToken = validate.value.accessToken;
    social.socialInfo = data;
    await social.save();

    res.locals.connect = {
      success: true
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.connectGoogle = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      accessToken: Joi.string().required()
    });

    const validate = Joi.validate(req.body, schema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const data = await Service.SocialConnect.Google.getProfile(validate.value.accessToken);
    let social = await DB.UserSocial.findOne({
      userId: req.user._id,
      socialId: data.id,
      social: 'google'
    });
    if (!social) {
      social = new DB.UserSocial({
        userId: req.user._id,
        social: 'google',
        socialId: data.id
      });
    }
    social.accessToken = validate.value.accessToken;
    social.socialInfo = data;
    await social.save();

    res.locals.connect = {
      success: true
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
