const Joi = require('joi');
const _ = require('lodash');

const validateSchema = Joi.object().keys({
  name: Joi.string().required(),
  maximumStrength: Joi.number().required().min(1),
  categoryIds: Joi.array().items(Joi.string()).optional(),
  mediaIds: Joi.array().items(Joi.string()).allow([null, '']).optional(),
  isOpen: Joi.boolean().allow(null, '').optional(),
  price: Joi.number().required(),
  description: Joi.string().allow([null, '']).optional(),
  mainImageId: Joi.string().required(),
  hashCourse: Joi.string().allow([null, '']).optional(),
  featured: Joi.boolean().allow([null]).optional(),
  alias: Joi.string().allow([null, '']).optional(),
  tutorId: Joi.string().allow([null, '']).optional(),
  isFree: Joi.boolean().allow(null, '').optional(),
  gradeIds: Joi.array().items(Joi.string()).optional(),
  subjectIds: Joi.array().min(1).items(Joi.string()).required(),
  topicIds: Joi.array().min(1).items(Joi.string()).required()
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.courseId || req.body.courseId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const query = Helper.App.isMongoId(id) ? { _id: id } : { alias: id };
    let course = await DB.Course.findOne(query)
      .populate({ path: 'tutor', select: 'name avatarUrl username country featured ratingAvg totalRating avatar bio completedByLearner' })
      .populate({ path: 'categories', select: '_id name alias' })
      .populate({ path: 'subjects', select: '_id name alias' })
      .populate({ path: 'topics', select: '_id name alias' })
      .populate({ path: 'mainImage', select: '_id name filePath thumbPath fileUrl thumbUrl convertStatus uploaded' })
      .populate({
        path: 'coupon',
        select: '_id value type'
      })
      .populate('media')
      .populate({ path: 'grades', select: '_id name' });
    if (!course) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    if (!req.user || (req.user && req.user.type === 'user')) {
      course.media = [];
    }
    const data = course.toObject();
    data.isFavorite = false;

    if (req.user) {
      const favorite = await DB.Favorite.findOne({ userId: req.user._id, courseId: course._id });
      if (favorite) {
        data.isFavorite = true;
      }

      data.booked = false;
      const booked = await DB.MyCourse.count({
        courseId: course._id,
        paid: true,
        $or: [{ userId: req.user._id }, { idRecipient: req.user._id }]
      });

      const progress = await DB.Progress.findOne({ userId: req.user._id, courseId: course._id });
      if (progress) {
        data.progress = progress.progressValue;
      }

      data.booked = booked > 0 ? true : false;
    }

    req.course = course;
    res.locals.course = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name'],
      boolean: ['featured', 'disabled']
    });
    if (req.query.tutorId) {
      query.tutorId = req.query.tutorId;
    }
    if (req.query.categoryIds) {
      const categoryIds = req.query.categoryIds.split(',');
      query.categoryIds = { $in: categoryIds };
    }
    if (req.query.subjectIds) {
      const subjectIds = req.query.subjectIds.split(',');
      query.subjectIds = { $in: subjectIds };
    }
    if (req.query.topicIds) {
      const topicIds = req.query.topicIds.split(',');
      query.topicIds = { $in: topicIds };
    }
    if (req.query.gradeIds) {
      const gradeIds = req.query.gradeIds.split(',');
      query.gradeIds = { $in: gradeIds };
    }
    if (!req.query.tutorName) req.query.tutorName = '';
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Course.count(query);
    let items = await DB.Course.find(query)
      .populate({
        path: 'tutor',
        match: { name: { $regex: req.query.tutorName, $options: 'i' } },
        select: 'name avatarUrl username country featured ratingAvg totalRating avatar '
      })
      .populate({ path: 'categories', select: '_id name alias' })
      .populate({ path: 'mainImage', select: '_id name filePath thumbPath fileUrl thumbUrl convertStatus uploaded' })
      .populate('coupon')
      .populate({ path: 'grades', select: '_id name' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    if (req.user) {
      items = await Promise.all(
        items.map(async item => {
          const data = item.toObject();

          const favorite = await DB.Favorite.count({
            userId: req.user._id,
            courseId: item._id
          });
          data.isFavorite = favorite ? true : false;

          const booked = await DB.MyCourse.count({
            courseId: item._id,
            paid: true,
            $or: [{ userId: req.user._id }, { idRecipient: req.user._id }]
          });

          const progress = await DB.Progress.findOne({ userId: req.user._id, courseId: item._id });
          if (progress) {
            data.progress = progress.progressValue;
          }

          data.booked = booked ? true : false;

          return data;
        })
      );
    }
    res.locals.list = { count, items };
    next();
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (req.user.type === 'student' || req.user.type === 'parent') {
      return next(PopulateResponse.error({ message: 'You are not authorized' }));
    }
    const tutorId = req.user.role === 'admin' && req.body.tutorId ? req.body.tutorId : req.user._id;
    const tutor = await DB.User.findOne({ _id: tutorId });
    if (!tutor) {
      return next(PopulateResponse.error({ message: 'Can not found the tutor!' }));
    }
    if (!tutor.isZoomAccount) {
      return next(PopulateResponse.error({ message: 'Tutor is not active on zoom!' }));
    }
    let hashCourse = validate.value.hashCourse || null;
    if (!hashCourse) {
      return next(PopulateResponse.error({ message: 'Please add schedule for Course' }));
    }
    let alias = req.body.alias ? Helper.String.createAlias(req.body.alias) : Helper.String.createAlias(req.body.name);
    const count = await DB.Course.count({ alias });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }
    const course = new DB.Course(
      Object.assign(_.omit(validate.value, 'hashCourse'), {
        tutorId,
        isOpen: true,
        alias
      })
    );

    await course.save();
    if (course.categoryIds && course.categoryIds.length) {
      await DB.User.update(
        {
          _id: course.tutorId
        },
        { $addToSet: { categoryIds: { $each: course.categoryIds } } }
      );
    }
    res.locals.create = course;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (req.user.type === 'student' || req.user.type === 'parent') {
      return next(PopulateResponse.error({ message: 'You are not authorized' }));
    }

    if (req.course.tutorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(404).send(
        PopulateResponse.error({
          message: 'You are not the creator of this course'
        })
      );
    }
    let alias = validate.value.alias ? Helper.String.createAlias(validate.value.alias) : Helper.String.createAlias(validate.value.name);
    const count = await DB.Course.count({
      alias,
      _id: { $ne: req.course._id }
    });
    if (count) {
      alias = `${alias}-${Helper.String.randomString(5)}`;
    }
    Object.assign(req.course, validate.value, { alias });
    await req.course.save();
    if (req.course.categoryIds && req.course.categoryIds.length) {
      await DB.User.update(
        {
          _id: req.course.tutorId
        },
        { $addToSet: { categoryIds: { $each: req.course.categoryIds } } }
      );
    }
    res.locals.update = req.course;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.course.tutorId.toString() !== req.user._id.toString()) {
      return res.status(404).send(
        PopulateResponse.error({
          message: 'You are not the creator of this course'
        })
      );
    }
    const appointments = await DB.Appointment.count({
      paid: true,
      courseId: req.course._id,
      status: { $nin: ['canceled', 'not-start'] }
    });
    if (appointments) {
      return next(
        PopulateResponse.error({
          message: 'Can not delete,already have users enrolled this course'
        })
      );
    }
    await req.course.remove();
    if (req.course.categoryIds && req.course.categoryIds.length) {
      await DB.User.update(
        {
          _id: req.course.tutorId
        },
        { $pull: { categoryIds: { $in: req.course.categoryIds } } }
      );
    }
    res.locals.remove = {
      message: 'Webinar is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.enrolledUsers = async (req, res, next) => {
  try {
    const id = req.params.courseId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const query = { targetId: id, paid: true, targetType: 'course' };
    const sort = Helper.App.populateDBSort(query);
    const count = await DB.Transaction.count(query);
    const items = await DB.Transaction.find(query).populate({ path: 'user', select: ' -_id name avatarUrl avatar' }).sort(sort).exec();
    res.locals.enrolled = { count, items };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const canChangeStatus = req.user.role === 'admin' || (req.user.type === 'tutor' && req.user._id.toString() === req.course.tutorId.toString());
    if (!canChangeStatus) return next(PopulateResponse.forbidden());
    req.course.disabled = !req.course.disabled;
    await req.course.save();
    res.locals.changeStatus = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.myCourse = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['name'],
      equal: ['userId', 'courseId']
    });
    const type = 'course';

    if (req.user) {
      query.userId = req.user._id;
    }

    const selectData = {
      path: 'course',
      select: 'name tutorId mainImageId price description alias',
      populate: [
        {
          path: 'mainImage'
        },
        {
          path: 'tutor',
          select: 'name avatarUrl username country featured ratingAvg totalRating avatar'
        }
      ]
    };

    query.paid = true;

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.MyCourse.count(query);
    const items = await DB.MyCourse.find(query)
      .populate(selectData)
      .populate({
        path: 'course',
        populate: {
          path: 'categories'
        }
      })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    let itemsCheckFavorite = [];
    switch (type) {
      case 'course':
        itemsCheckFavorite = await Service.Course.isBooked(items, req.user._id);
        break;
    }
    res.locals.list = { count, items: itemsCheckFavorite };
    next();
  } catch (e) {
    return next(e);
  }
};
