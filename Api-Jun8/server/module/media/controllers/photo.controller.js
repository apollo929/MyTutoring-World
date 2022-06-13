const Joi = require('joi');
const Image = require('../components/image');

exports.base64Upload = async (req, res, next) => {
  try {
    if (!req.body.base64) {
      return next();
    }

    const data = await Image.saveBase64Image(req.body.base64, req.body);
    req.base64Photo = data;
    return next();
  } catch (e) {
    throw e;
  }
};

/**
 * do upload a photo
 */
exports.upload = async (req, res, next) => {
  try {
    if (!req.file && !req.base64Photo) {
      return next(PopulateResponse.error({
        message: 'Missing photo file!'
      }, 'ERR_MISSING_PHOTO'));
    }

    const file = req.file || req.base64Photo;
    const schema = Joi.object().keys({
      name: Joi.string().allow(['', null]).optional(),
      description: Joi.string().allow(['', null]).optional(),
      categoryIds: Joi.array().items(Joi.string()).optional().default([]),
      systemType: Joi.string().allow(['', null]).optional()
    }).unknown();

    const validate = Joi.validate(req.body, schema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const photo = await Service.Media.createPhoto({
      value: validate.value,
      user: req.user,
      file
    });

    res.locals.photo = photo;
    return next();
  } catch (e) {
    return next(e);
  }
};
