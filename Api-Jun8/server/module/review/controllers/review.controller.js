const _ = require('lodash');
const Joi = require('joi');

exports.findOne = async (req, res, next) => {
  try {
    const review = await DB.Review.findOne({ _id: req.params.reviewId })
      .populate({ path: 'rater', select: '_id name username avatar avatarUrl email notificationSettings' })
      .populate({ path: 'rater', select: '_id name username avatar avatarUrl email notificationSettings' })
      .populate({ path: 'tutor', select: '_id name username avatar avatarUrl ' })
      .populate({ path: 'webinar', select: '_id name' })
      .populate({ path: 'appointment', populate: { path: 'subject', select: '_id name' } });
    if (!review) {
      return res.status(404).send(PopulateResponse.notFound());
    }

    req.review = review;
    res.locals.review = review;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * Create a new rating
 */
exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      type: Joi.string().valid(['subject', 'webinar', 'course']).optional().default('subject'),
      appointmentId: Joi.string()
        .allow([null, ''])
        .when('type', {
          is: 'webinar' || 'subject',
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
      webinarId: Joi.string().allow([null, '']).when('type', {
        is: 'webinar',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      courseId: Joi.string().allow([null, '']).when('type', {
        is: 'course',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    let review = null;
    if (validate.value.type === 'course') {
      review = await Service.Review.reviewCourse(req.user, validate.value);
    } else {
      review = await Service.Review.create(req.user, validate.value);
    }
    review.rater = req.user.getPublicProfile();
    res.locals.review = review;
    return next();
  } catch (e) {
    return next(e);
  }
};

/**
 * do update for user profile or admin update
 */
exports.update = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      rating: Joi.number().min(1).max(5).optional(),
      comment: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.review.rateBy.toString()) {
      return next(PopulateResponse.forbidden());
    }

    const user = await DB.User.findOne({ _id: req.review.rateBy });
    _.merge(req.review, validate.value);
    await req.review.save();
    if (req.review.type === 'course') {
      await Service.Review.updateReviewScoreCourse(req.review.courseId, user);
    } else {
      await Service.Review.updateReviewScoreAppointment(req.review.appointmentId, user);
    }

    req.review.rater = user.getPublicProfile();
    res.locals.update = req.review;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.review.rateBy.toString()) {
      return next(PopulateResponse.forbidden());
    }

    if (req.user.role === 'admin' && req.user._id != req.review.rateBy) {
      if (req.review.rater.notificationSettings)
        await Service.Mailer.send('review/review-removed-by-admin.html', req.review.rater.email, {
          subject: `Your review has been removed`,
          review: req.review
        });
    }
    const user = req.review.rater;
    if (req.review.type === 'course') {
      await Service.Review.updateReviewScoreCourse(req.review.courseId, user);
    } else {
      await Service.Review.updateReviewScoreAppointment(req.review.appointmentId, user);
    }

    await req.review.remove();

    res.locals.remove = {
      message: 'Review is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

/**
 * get list review
 */
exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['webinarId', 'rateBy', 'type', 'rateTo', 'appointmentId', 'courseId']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Review.count(query);
    const items = await DB.Review.find(query)
      .populate({ path: 'rater', select: '_id name username avatar avatarUrl' })
      .populate({ path: 'webinar', select: '_id name' })
      .populate({ path: 'appointment', populate: { path: 'subject', select: '_id name' } })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    res.locals.list = {
      count,
      items
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.getMyCurrentReview = async (req, res, next) => {
  try {
    // const query = {
    //   rateBy: req.user._id
    // };
    const query = {};
    query.appointmentId = req.params.itemId;
    if (req.query.rateBy) query.rateBy = req.query.rateBy;
    if (req.query.rateTo) query.rateTo = req.query.rateTo;
    const review = await DB.Review.findOne(query).populate('rater');
    res.locals.review = review;
    next();
  } catch (e) {
    next(e);
  }
};

exports.isReview = async (req, res, next) => {
  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['webinarId', 'type', 'rateTo', 'appointmentId', 'courseId']
    });
    query.rateBy = req.user._id;
    const count = await DB.Review.count(query);
    res.locals.isReview = count > 0;
    next();
  } catch (e) {
    next(e);
  }
};
