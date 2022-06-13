const Joi = require('joi');
const moment = require('moment');
const availableTimeWebinarQ = require('../available-time-queue');
const availableTimeTutorQ = require('../../tutor/available-time-queue');

exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      webinarId: Joi.string().allow([null, '']).optional(),
      startTime: Joi.string().required(),
      toTime: Joi.string().required(),
      type: Joi.string().allow([null, '']).optional().default('webinar'),
      hashWebinar: Joi.string().allow([null, '']).optional(),
      tutorId: Joi.string().allow([null, '']).optional(),
      isFree: Joi.boolean().allow([null, '']).optional().default(false),
      isDST: Joi.boolean().allow([null, '']).optional().default(false),
      dtsStartTime: Joi.string().required(),
      dtsToTime: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (validate.value.type === 'webinar' && !validate.value.webinarId && !validate.value.hashWebinar) {
      return next(
        PopulateResponse.error({
          message: 'Missing params'
        })
      );
    }

    const tutorId = req.user.role === 'admin' && req.body.tutorId ? req.body.tutorId : req.user._id;
    const tutor = await DB.User.findOne({ _id: tutorId });
    if (!tutor) {
      return next(PopulateResponse.error({ message: 'Can not found the tutor!' }));
    }

    if (!tutor.isZoomAccount) {
      return next(PopulateResponse.error({ message: 'Tutor is not active on zoom!' }));
    }
    const data = await Service.Schedule.create(tutorId, validate.value);
    if (data.type === 'webinar' && data.webinarId) {
      await DB.Webinar.update(
        {
          _id: data.webinarId
        },
        {
          $addToSet: {
            slotIds: data._id
          }
        }
      );
      await availableTimeWebinarQ.addAvailableTime(data);
    }
    await availableTimeTutorQ.addAvailableTime(data);
    res.locals.create = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const slot = await DB.Schedule.findOne({
      _id: req.params.slotId
    });
    if (!slot) {
      return next(PopulateResponse.notFound());
    }
    if (req.user.role !== 'admin' && slot.tutorId.toString() !== req.user._id.toString()) {
      return next(PopulateResponse.forbidden());
    }

    const countAppointment = await DB.Appointment.count({
      slotId: slot._id,
      paid: true
    });

    if (countAppointment) {
      return next(
        PopulateResponse.error({
          message: 'Can not delete,already have users enrolled this slot'
        })
      );
    }

    if ((slot.status === 'pending' || slot.status === 'progressing') && !slot.hashWebinar) {
      return next(
        PopulateResponse.error({
          message: 'Can not delete, this slot not completed!'
        })
      );
    }

    await slot.remove();
    await Service.Webinar.updateLastDate(slot);
    if (slot.type === 'webinar') {
      await availableTimeWebinarQ.removeAvailableTime(slot);
    }
    await availableTimeTutorQ.removeAvailableTime(slot);
    res.locals.remove = {
      success: true
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const sort = Helper.App.populateDBSort(req.query);
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['webinarId', 'tutorId', 'type', 'hashWebinar'],
      boolean: ['isFree']
    });

    // if (!query.type) {
    //   query.type = 'webinar';
    // }

    if (!query.tutorId && query.type === 'subject') {
      query.tutorId = req.user._id;
      return next(
        PopulateResponse.error({
          message: 'Missing tutorId in the query'
        })
      );
    }
    if (!query.webinarId && query.type === 'webinar' && !query.hashWebinar) {
      return next(
        PopulateResponse.error({
          message: 'Missing webinarId in the query'
        })
      );
    }

    if (req.query.startTime && req.query.toTime) {
      query.startTime = {
        $gte: moment(req.query.startTime).toDate(),
        $lte: moment(req.query.toTime).toDate()
      };
    }

    if (req.query.displayStartTime && req.query.displayToTime) {
      query.displayStartTime = {
        $gte: moment(req.query.displayStartTime).toDate(),
        $lte: moment(req.query.displayToTime).toDate()
      };
    }

    // const sort = {
    //   startTime: -1
    // };
    const count = await DB.Schedule.count(query);
    let items = await DB.Schedule.find(query, { meta: 0, hashWebinar: 0 })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    items = await Promise.all(
      items.map(async item => {
        const data = item.toObject();
        if (moment.utc().add(30, 'minutes').isAfter(moment.utc(data.startTime))) {
          data.disable = true;
        } else {
          data.disable = false;
        }
        data.booked = false;
        if (item.type === 'webinar') {
          const countBooked = await DB.Transaction.count({ slotId: item._id, paid: true });
          const webinar = await DB.Webinar.findOne({ _id: item.webinarId });
          data.webinarName = (webinar && webinar.name) || '';
          if (countBooked) {
            data.booked = true;
          }
        } else if (item.type === 'subject') {
          const countBooked = await DB.Appointment.count({
            startTime: moment(item.startTime).toDate(),
            toTime: moment(item.toTime).toDate(),
            paid: true,
            status: {
              $in: ['progressing', 'booked', 'pending', 'completed']
            },
            targetType: {
              $ne: 'webinar'
            },
            tutorId: query.tutorId
          });
          if (countBooked) {
            data.booked = true;
          }
        }
        return data;
      })
    );
    res.locals.list = {
      count,
      items
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      webinarId: Joi.string().allow([null, '']).optional(),
      startTime: Joi.string().required(),
      toTime: Joi.string().required(),
      status: Joi.string().optional(),
      type: Joi.string().allow([null, '']).optional().default('webinar'),
      hashWebinar: Joi.string().allow([null, '']).optional(),
      isDST: Joi.boolean().allow([null, '']).optional().default(false),
      dtsStartTime: Joi.string().required(),
      dtsToTime: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (validate.value.type === 'webinar' && !validate.value.webinarId && !validate.value.hashWebinar) {
      return next(
        PopulateResponse.error({
          message: 'Missing webinar'
        })
      );
    }

    // Find Available Time with slotId
    const slot = await DB.Schedule.findOne({
      _id: req.params.slotId
    });
    if (!slot) {
      return next(PopulateResponse.notFound());
    }

    const countAppointment = await DB.Appointment.count({
      slotId: slot._id,
      paid: true
    });

    if (countAppointment) {
      return next(
        PopulateResponse.error({
          message: 'Can not update,already have users enrolled this slot'
        })
      );
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== slot.tutorId.toString()) {
      return next(PopulateResponse.forbidden());
    }
    // if (req.user._id.toString() !== slot.tutorId.toString()) {
    //   return next(PopulateResponse.forbidden());
    // }
    const result = await Service.Schedule.update(slot._id, validate.value);
    if (slot.type === 'webinar') {
      await availableTimeWebinarQ.updateAvailableTime(result, slot);
    }
    await availableTimeTutorQ.updateAvailableTime(result, slot);
    res.locals.update = result;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.removeByHash = async (req, res, next) => {
  try {
    const shedules = await DB.Schedule.find({ hashWebinar: req.params.hash });
    if (shedules && shedules.length > 0) {
      await Promise.all(
        shedules.map(async item => {
          if (!item.webinarId) {
            await item.remove();
          } else if (item.webinarId) {
            item.hashWebinar = '';
            await item.save();
          }
        })
      );
    }
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.checkByHash = async (req, res, next) => {
  try {
    const schedules = await DB.Schedule.find({ hashWebinar: req.params.hash });
    res.locals.checkHash = schedules && schedules.length > 0 ? { success: true } : { success: false };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.checkByWebinar = async (req, res, next) => {
  try {
    const schedules = await DB.Schedule.find({ webinarId: req.params.webinarId });
    res.locals.checkByWebinar = schedules && schedules.length > 0 ? { success: true } : { success: false };
    return next();
  } catch (e) {
    return next(e);
  }
};

// update status
