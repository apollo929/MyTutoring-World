const _ = require('lodash');
const Joi = require('joi');

const validateSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().allow([null, '']).optional(),
  fromYear: Joi.number().required(),
  toYear: Joi.number().optional(),
  type: Joi.string().required(),
  verified: Joi.boolean().required(),
  ordering: Joi.number().allow([null, '']).optional(),
  documentId: Joi.string().required(),
  tutorId: Joi.string().optional()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.resumeId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const query = Helper.App.isMongoId(id) ? { _id: id } : {};
    const certificate = await DB.Certification.findOne(query);
    if (!certificate) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.certificate = certificate;
    // res.locals.certificate = certificate;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.create = async function (req, res, next) {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if ((req.user && req.user.role !== 'admin' && req.user.type !== 'tutor') || !req.user) {
      return next(
        PopulateResponse.forbidden({
          message: 'Forbidden resource'
        })
      );
    }
    let query = { _id: req.user._id };

    if (req.user.role === 'admin') {
      query = Helper.App.isMongoId(req.body.tutorId)
        ? { _id: req.body.tutorId }
        : { username: req.body.tutorId || null };
    }

    const tutor = await DB.User.findOne(query);
    if (!tutor) {
      return next(
        PopulateResponse.notFound({
          message: 'Tutor not found'
        })
      );
    }
    const certificate = new DB.Certification(
      Object.assign(validate.value, {
        tutorId: tutor._id
      })
    );
    const { type } = validate.value;
    let queryUpdate = {};
    if (type === 'education') {
      queryUpdate = {
        educationIds: certificate._id
      };
    } else if (type === 'experience') {
      queryUpdate = {
        experienceIds: certificate._id
      };
    } else {
      queryUpdate = {
        certificationIds: certificate._id
      };
    }
    await certificate.save();
    await DB.User.update(
      { _id: tutor._id },
      {
        $addToSet: queryUpdate
      }
    );
    res.locals.create = certificate;
    next();
  } catch (error) {
    return next(error);
  }
};

exports.update = async function (req, res, next) {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if ((req.user && req.user.role !== 'admin' && req.user.type !== 'tutor') || !req.user) {
      return next(
        PopulateResponse.forbidden({
          message: 'Forbidden resource'
        })
      );
    }
    _.merge(req.certificate, validate.value);
    await req.certificate.save();
    res.locals.update = req.certificate;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.delete = async function (req, res, next) {
  try {
    await req.certificate.remove();
    const { type } = req.certificate;
    let queryUpdate = {};
    if (type === 'education') {
      queryUpdate = {
        educationIds: req.certificate._id
      };
    } else if (type === 'experience') {
      queryUpdate = {
        experienceIds: req.certificate._id
      };
    } else {
      queryUpdate = {
        certificationIds: req.certificate._id
      };
    }
    await DB.User.update(
      { _id: req.certificate.tutorId },
      {
        $pull: queryUpdate
      }
    );
    res.locals.delete = {
      message: 'Certificate is deleted'
    };
    return next();
  } catch (error) {
    return next(error);
  }
};
