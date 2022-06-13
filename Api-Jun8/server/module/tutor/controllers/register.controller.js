const Joi = require('joi');

exports.register = async (req, res, next) => {
  // let countryCode = '';
  // if (validate.value.country) {
  //   countryCode = validate.value.country.code || '';
  // }
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phoneNumber: Joi.string().allow(['', null]).optional(),
      name: Joi.string().allow(['', null]).optional(),
      bio: Joi.string().allow([null, '']).optional(),
      // issueDocument: Joi.string().required(),
      // resumeDocument: Joi.string().required(),
      // certificationDocument: Joi.string().required(),
      timezone: Joi.string().allow(['', null]).optional(),
      introVideoId: Joi.string().allow(['', null]).optional(),
      introYoutubeId: Joi.string().allow(['', null]).optional(),
      country: Joi.object().allow(null).optional(),
      avatar: Joi.string().allow(['', null]).optional(),
    });
    // if (!req.file) {
    //   return next(
    //     PopulateResponse.error(
    //       {
    //         message: 'Missing document'
    //       },
    //       'ERR_MISSING_FILE'
    //     )
    //   );
    // }

    const validate = Joi.validate(req.body, schema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    // validate.value.issueDocumentFile = req.file;
    console.log(validate.value);
    await Service.Tutor.register(validate.value);

    res.locals.register = PopulateResponse.success(
      {
        message: 'Your account has been created, please check your email to access it'
      },
      'USE_CREATED'
    );
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(
        PopulateResponse.error(
          {
            message: 'Missing document'
          },
          'ERR_MISSING_FILE'
        )
      );
    }

    const file = await Service.Media.createFileWithoutOwner({
      value: { systemType: 'document' },
      file: req.file
    });

    res.locals.upload = file;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.uploadIntroVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(
        PopulateResponse.error(
          {
            message: 'Missing video'
          },
          'ERR_MISSING_FILE'
        )
      );
    }

    const file = await Service.Media.createVideoWithoutOwner({
      value: { systemType: 'video' },
      file: req.file
    });

    res.locals.upload = file;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.uploadIntroImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(
        PopulateResponse.error(
          {
            message: 'Missing image'
          },
          'ERR_MISSING_FILE'
        )
      );
    }

    const file = await Service.Media.createImageWithoutOwner({
      value: { systemType: 'image' },
      file: req.file
    });

    res.locals.upload = file;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.reject = async (req, res, next) => {
  try {
    await Service.Tutor.reject(req.params.tutorId, req.body.reason);
    res.locals.reject = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.approve = async (req, res, next) => {
  try {
    await Service.Tutor.approve(req.params.tutorId);
    res.locals.approve = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};
