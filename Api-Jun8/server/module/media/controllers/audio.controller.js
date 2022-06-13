const Joi = require('joi');

/**
 * do upload a photo
 */
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(
        PopulateResponse.error(
          {
            message: 'Missing audio file!'
          },
          'ERR_MISSING_AUDIO'
        )
      );
    }

    const schema = Joi.object()
      .keys({
        name: Joi.string().allow(['', null]).optional(),
        description: Joi.string().allow(['', null]).optional(),
        categoryIds: Joi.array().items(Joi.string()).optional().default([]),
        systemType: Joi.string().allow(['', null]).optional()
      })
      .unknown();

    const validate = Joi.validate(req.body, schema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const audio = await Service.Media.createAudio({
      value: validate.value,
      user: req.user,
      file: req.file
    });

    res.locals.audio = audio;
    return next();
  } catch (e) {
    return next(e);
  }
};
