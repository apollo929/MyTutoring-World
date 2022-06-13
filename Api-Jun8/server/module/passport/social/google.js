const Joi = require('joi');
const signToken = require('../auth.service').signToken;

exports.login = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      accessToken: Joi.string().required()
    });

    const validate = Joi.validate(req.body, schema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const data = await Service.SocialConnect.Google.getProfile(validate.value.accessToken);
    let email = data.email;
    if (!email && data.emails) {
      email = data.emails[0].value;
    }
    let user = await DB.User.findOne({ email });
    let isNew = false;
    if (!user) {
      user = new DB.User({
        email,
        name: data.displayName,
        provider: 'google'
      });

      await user.save();
      isNew = true;
    }

    let social;
    if (!isNew) {
      social = await DB.UserSocial.findOne({
        userId: user._id,
        socialId: data.id,
        social: 'google'
      });
    }

    if (!social) {
      social = new DB.UserSocial({
        userId: user._id,
        social: 'google',
        socialId: data.id
      });
    }
    social.accessToken = validate.value.accessToken;
    social.socialInfo = data;
    await social.save();

    const expireTokenDuration = 60 * 60 * 24 * 7; // 7 days
    const now = new Date();
    const expiredAt = new Date(now.getTime() + (expireTokenDuration * 1000));
    const token = signToken(user._id, user.role, expireTokenDuration);

    res.locals.login = {
      token,
      expiredAt
    };

    return next();
  } catch (e) {
    return next(e);
  }
};
