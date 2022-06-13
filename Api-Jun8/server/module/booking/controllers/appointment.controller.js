const Joi = require('joi');
const moment = require('moment');
const _ = require('lodash');
const momentTimeZone = require('moment-timezone');

const enrollQ = require('../../webinar/queue');

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['description'],
      equal: ['status', 'userId', 'tutorId', 'webinarId', 'targetType'],
      boolean: ['paid']
    });
    if (req.query.startTime && req.query.toTime) {
      query.startTime = {
        $gte: moment(req.query.startTime).toDate(),
        $lte: moment(req.query.toTime).add(1, 'days').toDate()
      };
    }

    if (req.query.displayStartTime && req.query.displayToTime) {
      query.displayStartTime = {
        $gte: moment(req.query.displayStartTime).toDate(),
        $lte: moment(req.query.displayToTime).add(1, 'days').toDate()
      };
    }

    if (req.user.role !== 'admin') {
      query.$or = [
        {
          userId: req.user._id
        },
        {
          tutorId: req.user._id
        },
        {
          idRecipient: req.user._id
        }
      ];
    }

    query.visible = true;
    // query.paid = true;
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Appointment.count(query);
    let items = await DB.Appointment.find(query)
      .populate({ path: 'user', select: '_id name username' })
      .populate({ path: 'tutor', select: '_id name username' })
      .populate({ path: 'subject', select: '_id name alias' })
      .populate({ path: 'topic', select: '_id name alias' })
      .populate({ path: 'category', select: '_id name  alias' })
      .populate({ path: 'webinar', select: '_id name price alias' })
      .populate({ path: 'transaction', select: req.user.role !== 'admin' ? '-commission -balance' : '' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    items = await Promise.all(
      items.map(item => {
        const data = item.toObject();
        if (
          data.zoomData &&
          data.zoomData.start_url &&
          data.transaction &&
          data.transaction.paid &&
          !data.transaction.isRefund &&
          data.status !== 'canceled' &&
          data.status !== 'not-start'
        ) {
          data.zoomUrl = req.user.type === 'tutor' ? data.zoomData.start_url : data.zoomData.join_url;
        }
        delete data.zoomData;
        return data;
      })
    );

    res.locals.list = {
      count,
      items
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.tutorAppointmentTime = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['userId', 'targetType']
    });
    query.tutorId = req.params.tutorId;

    if (req.query && req.query.status && req.query.status.length) {
      const status = req.query.status.split(',');
      query.status = {
        $in: status
      };
    }

    if (req.query.startTime && req.query.toTime) {
      query.startTime = {
        $gte: moment(req.query.startTime).toDate(),
        $lte: moment(req.query.toTime).add(1, 'days').toDate()
      };
    }

    query.visible = true;
    query.paid = true;
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Appointment.count(query);
    const items = await DB.Appointment.find(query)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = {
      count,
      items: items.map(item => _.pick(item, ['startTime', 'toTime', 'status', 'isFree']))
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      reason: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const data = await Service.Appointment.cancel(req.params.appointmentId, validate.value.reason, req.user._id);
    res.locals.cancel = data;
    next();
  } catch (e) {
    next(e);
  }
};

exports.tutorCancel = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      reason: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const appointment = await DB.Appointment.findOne({ _id: req.params.appointmentId });
    if (!appointment) {
      return next(PopulateResponse.notFound());
    }

    if (req.user._id.toString() !== appointment.tutorId.toString()) {
      return next(PopulateResponse.forbidden());
    }

    const data = await Service.Appointment.userCancel(appointment, validate.value.reason, req.user._id);
    res.locals.tutorCancel = data;
    next();
  } catch (e) {
    next(e);
  }
};

exports.studentCancel = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      reason: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const appointment = await DB.Appointment.findOne({ _id: req.params.appointmentId });
    if (!appointment) {
      return next(PopulateResponse.notFound());
    }

    if (req.user._id.toString() !== appointment.userId.toString()) {
      return next(PopulateResponse.forbidden());
    }

    const data = await Service.Appointment.userCancel(appointment, validate.value.reason, req.user._id);
    res.locals.studentCancel = data;
    next();
  } catch (e) {
    next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const item = await DB.Appointment.findOne({ _id: req.params.appointmentId })
      .populate({ path: 'user', select: '_id name username totalRating ratingAvg' })
      .populate({ path: 'tutor', select: '_id name username totalRating ratingAvg' })
      .populate({ path: 'subject', select: '_id name price alias' })
      .populate({ path: 'topic', select: '_id name alias' })
      .populate({ path: 'category', select: '_id name  alias' })
      .populate('documents')
      .populate({
        path: 'webinar',
        select: '_id name price mediaIds alias',
        populate: { path: 'media' }
      })
      .populate({ path: 'transaction', select: req.user.role !== 'admin' ? '-commission -balance' : '' });
    if (!item) {
      return next(PopulateResponse.notFound());
    }
    const data = item.toObject();
    if (!data.paid && data.webinar && data.webinar.mediaIds && data.webinar.mediaIds.length) {
      data.webinar.media = [];
    }

    if (
      data.zoomData &&
      data.zoomData.start_url &&
      data.transaction &&
      data.transaction.paid &&
      !data.transaction.isRefund &&
      data.status !== 'canceled' &&
      data.status !== 'not-start'
    ) {
      data.zoomUrl = req.user.type === 'tutor' ? data.zoomData.start_url : data.zoomData.join_url;
    }
    delete data.zoomData;
    // TODO - validate permission?
    req.appointment = item;
    res.locals.appointment = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.updateDocument = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      documentIds: Joi.array().items(Joi.string()).allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const id = req.params.appointmentId;
    if (!id) {
      return next(PopulateResponse.error({ message: 'Missing params' }));
    }
    const appointment = await DB.Appointment.findOne({ _id: id });
    if (!appointment) {
      return next(PopulateResponse.notFound());
    }
    appointment.documentIds = validate.value.documentIds;
    await appointment.save();
    res.locals.updateDocument = appointment;
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

    const file = await Service.Media.createFile({
      value: { systemType: 'document' },
      file: req.file,
      user: req.user
    });
    if (req.appointment) {
      const user = await DB.User.findOne({ _id: req.appointment.userId });
      const tutor = await DB.User.findOne({ _id: req.appointment.tutorId });
      if (user && tutor) {
        if (req.user.type === 'tutor') {
          const startTimeUser = user.timezone
            ? momentTimeZone(req.appointment.startTime).tz(user.timezone).format('DD/MM/YYYY HH:mm')
            : moment(req.appointment.startTime).format('DD/MM/YYYY HH:mm');
          const toTimeUser = user.timezone
            ? momentTimeZone(req.appointment.toTime).tz(user.timezone).format('DD/MM/YYYY HH:mm')
            : moment(req.appointment.toTime).format('DD/MM/YYYY HH:mm');
          if (user.notificationSettings)
            await Service.Mailer.send('material/class-uploaded.html', user.email, {
              subject: 'New material uploaded',
              user: user.getPublicProfile(),
              tutor: tutor.getPublicProfile(),
              title: 'New Material Uploaded!',
              appointment: req.appointment.toObject(),
              startTime: startTimeUser,
              toTime: toTimeUser
            });
        } else {
          const startTimeUser = tutor.timezone
            ? momentTimeZone(req.appointment.startTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
            : moment(req.appointment.startTime).format('DD/MM/YYYY HH:mm');
          const toTimeUser = tutor.timezone
            ? momentTimeZone(req.appointment.toTime).tz(tutor.timezone).format('DD/MM/YYYY HH:mm')
            : moment(req.appointment.toTime).format('DD/MM/YYYY HH:mm');
          if (tutor.notificationSettings)
            await Service.Mailer.send('material/class-uploaded-by-student.html', tutor.email, {
              subject: 'New material uploaded',
              user: user.getPublicProfile(),
              tutor: tutor.getPublicProfile(),
              title: 'New Material Uploaded By Student!',
              appointment: req.appointment.toObject(),
              startTime: startTimeUser,
              toTime: toTimeUser
            });
        }
      }
    }

    res.locals.upload = file;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.reSchedule = async (req, res, next) => {
  try {
    const appointment = await DB.Appointment.findOne({ _id: req.params.id });
    if (!appointment) return next(PopulateResponse.notFound());
    let canReschedule = await Service.Appointment.canReschedule(appointment);
    if (!canReschedule) {
      return next(
        PopulateResponse.error({
          message: 'Cannot reschedule the class starting within 8 hours'
        })
      );
    }
    const startTime = req.body.startTime;
    const toTime = req.body.toTime;

    await DB.Appointment.update(
      { _id: req.params.id },
      {
        $set: { startTime, toTime }
      }
    );

    await enrollQ.rescheduleClass(appointment._id);
    res.locals.reSchedule = {
      message: 'Ok'
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.canReschedule = async (req, res, next) => {
  try {
    let canReschedule = await Service.Appointment.canReschedule(req.appointment);
    res.locals.canReschedule = {
      canReschedule: canReschedule
    };
    return next();
  } catch (e) {
    next(e);
  }
};

exports.reviewStudent = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      rating: Joi.number().required(),
      comment: Joi.string().allow(['', null]).optional(),
      createdAt: Joi.string().allow(['', null]).optional(),
      updated: Joi.boolean().optional().default(false)
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const appointment = await DB.Appointment.findOne({ _id: req.params.appointmentId });
    if (!appointment) {
      return next(PopulateResponse.notFound());
    }

    if (appointment.tutorId.toString() != req.user._id) {
      return next(PopulateResponse.forbidden());
    }
    if (appointment.status !== 'completed') {
      return next(PopulateResponse.error({ message: 'You can review student only when the appointment is completed' }));
    }

    const review = {
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: new Date().toISOString()
    };
    await DB.Appointment.update(
      { _id: req.params.appointmentId },
      {
        $set: { studentReview: review }
      }
    );

    const student = await DB.User.findOne({ _id: appointment.userId });
    const tutor = req.user;

    if (req.body.updated == false && student.notificationSettings == true) {
      //send mail notify to student
      await Service.Mailer.send('review/notify-review-student.html', student.email, {
        subject: `Your teacher reviewed the meeting #${appointment.code}`,
        review: review,
        appointment: appointment.toObject(),
        tutor: tutor.toObject(),
        student: student.toObject(),
        appName: process.env.APP_NAME
      });
    }
    res.locals.review = {
      review: review
    };
    return next();
  } catch (e) {
    return next(e);
  }
};
