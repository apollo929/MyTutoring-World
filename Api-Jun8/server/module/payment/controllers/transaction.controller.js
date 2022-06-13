const Joi = require('joi');
const moment = require('moment');
exports.enroll = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      targetType: Joi.string().required(),
      tutorId: Joi.string().required(),
      targetId: Joi.string().required(),
      redirectSuccessUrl: Joi.string().optional(),
      cancelUrl: Joi.string().optional(),
      couponCode: Joi.string().allow([null, '']).optional(),
      type: Joi.string().optional().default('booking'),
      emailRecipient: Joi.string().email().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    if (validate.value.type === 'gift') {
      if (!validate.value.emailRecipient || validate.value.emailRecipient === '' || !validate.value.emailRecipient === undefined) {
        return next(PopulateResponse.error({ message: 'Please enter email recipient' }));
      }
    }

    const tutor = await DB.User.findOne({ _id: validate.value.tutorId });
    if (!tutor) {
      return next(PopulateResponse.error({ message: 'Tutor not found' }));
    }
    let webinar = null;
    let course = null;
    let subject = null;
    const targetType = validate.value.targetType;
    let target = null;
    let filter = {
      targetId: validate.value.targetId
    };
    if (targetType === 'webinar') {
      webinar = await DB.Webinar.findOne({ _id: validate.value.targetId });
      if (!webinar) {
        return next(PopulateResponse.error({ message: 'Webinar not found' }));
      }
      if (webinar.numberParticipants >= webinar.maximumStrength) {
        return next(PopulateResponse.error({ message: 'Full participants' }));
      }
      target = webinar;
    } else if (targetType === 'course') {
      course = await DB.Course.findOne({ _id: validate.value.targetId });
      if (!course) {
        return next(PopulateResponse.error({ message: 'Course not found' }));
      }
      target = course;
    } else {
      subject = await DB.MySubject.findOne({ _id: validate.value.targetId });
      if (!subject) {
        return next(PopulateResponse.error({ message: 'Subject not found' }));
      }
      target = subject;
    }

    if (req.user._id.toString() === validate.value.tutorId.toString()) {
      return next(
        PopulateResponse.error({
          message: 'Could not book your item'
        })
      );
    }

    const params = Object.assign(filter, {
      tutorId: validate.value.tutorId,
      paid: true,
      $or: [{ userId: req.user._id }, { idRecipient: req.user._id }]
    });

    const isEnroll = await DB.Transaction.count(
      validate.value.type === 'booking' ? params : Object.assign({ emailRecipient: validate.value.emailRecipient }, params)
    );

    if (isEnroll) {
      const message = validate.value.type === 'booking' ? 'You are enrolled this item' : 'You have already gifted this email';
      return next(PopulateResponse.error({ message }));
    }
    if (!target) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    const data = await Service.Payment.createPaymentIntentByStripe(
      Object.assign(
        {
          userId: req.user._id,
          tutorId: validate.value.tutorId,
          price: targetType === 'subject' ? subject.price : target.price,
          name: target.name || 'No name',
          targetType,
          target,
          description: `${req.user.name} buy ${targetType} "${target.name}" of tutor ${tutor.name}`
        },
        validate.value
      )
    );
    // if (!data.stripeClientSecret) {
    //   return next(PopulateResponse.error({ message: 'No transaction is possible! Please try again' }));
    // }
    res.locals.enroll = data;
    return next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['targetType', 'userId', 'tutorId', 'targetId', 'status'],
      text: ['code', 'description']
    });
    let excludeFields = {};
    if (req.user.role !== 'admin') {
      excludeFields = { commission: 0, balance: 0, vat: 0, paymentInfo: 0 };
      query.userId = req.user._id;
    }
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Transaction.count(query);
    let items = await DB.Transaction.find(query, excludeFields)
      .populate({ path: 'user', select: '_id name username' })
      .populate({ path: 'tutor', select: '_id name username' })
      .populate({ path: 'recipient', select: '_id name' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    items = await Promise.all(
      items.map(async item => {
        let target = null;
        let subject = null;
        if (item.targetId) {
          if (item.targetType === 'webinar') {
            target = await DB.Webinar.findOne({ _id: item.targetId }, { name: 1, alias: 1 });
          } else if (item.targetType === 'subject') {
            target = await DB.MyTopic.findOne({ _id: item.targetId }, { name: 1, alias: 1, mySubjectId: 1 });
            if (!target) {
              target = await DB.MySubject.findOne({ _id: item.targetId }, { name: 1, alias: 1 });
            } else if (target && target.mySubjectId) {
              subject = await DB.MySubject.findOne({ _id: target.mySubjectId }, { name: 1, alias: 1 });
            }
          }
        }
        const data = item.toObject();
        data[item.targetType] = target;
        data.tutorSubject = subject;
        return data;
      })
    );
    res.locals.list = {
      count,
      items
    };
    next();
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const transaction = await DB.Transaction.findOne({ _id: req.params.transactionId })
      .populate({ path: 'user', select: '_id name username' })
      .populate({ path: 'tutor', select: '_id name username' })
      .populate({ path: 'recipient', select: '_id name' });
    let target = null;
    let subject = null;
    const targetType = transaction.targetType;
    if (transaction.targetId) {
      if (targetType === 'webinar') {
        target = await DB.Webinar.findOne({ _id: transaction.targetId }, { name: 1, alias: 1 });
      } else if (targetType === 'subject') {
        target = await DB.MyTopic.findOne({ _id: transaction.targetId }, { name: 1, alias: 1, mySubjectId: 1 });
        if (!target) {
          target = await DB.MySubject.findOne({ _id: transaction.targetId }, { name: 1, alias: 1 });
        } else if (target && target.mySubjectId) {
          subject = await DB.MySubject.findOne({ _id: target.mySubjectId }, { name: 1, alias: 1 });
        }
      }
    }
    const data = transaction.toObject();
    data[transaction.targetType] = target;
    data.tutorSubject = subject;
    req.transaction = transaction;
    res.locals.transaction = data;
    next();
  } catch (e) {
    next(e);
  }
};

exports.booked = async (req, res, next) => {
  try {
    const id = req.params.id;
    const targetType = req.params.targetType;
    if (!id || !targetType) {
      return next(PopulateResponse.validationError());
    }
    let target = null;
    if (targetType === 'webinar') {
      target = await DB.Webinar.findOne({ _id: id });
      if (!target) {
        return next(PopulateResponse.error({ message: 'Webinar not found' }));
      }
      if (target.numberParticipants >= target.maximumStrength) {
        return next(PopulateResponse.error({ message: 'Full participants' }));
      }
    } else if (targetType === 'course') {
      target = await DB.Course.findOne({ _id: id });
      if (!target) {
        return next(PopulateResponse.error({ message: 'Course not found' }));
      }
    }

    const params = {
      targetId: id,
      paid: true,
      $or: [{ userId: req.user._id }, { idRecipient: req.user._id }]
    };

    const isEnroll = await DB.Transaction.count(params);

    // Check if the appointment has expired, then the user can rebook.
    const pendingAppointment = await DB.Appointment.count({
      status: {
        $in: ['pending', 'booked', 'progressing']
      },
      paid: true,
      webinarId: id
    });

    res.locals.booked = { booked: isEnroll && pendingAppointment ? true : false };
    return next();
  } catch (error) {
    next(error);
  }
};

exports.checkOverlapWebinar = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      userId: Joi.string().required(),
      webinarId: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const webinar = await DB.Webinar.findOne({ _id: validate.value.webinarId });
    if (!webinar) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    let overlapSlots = [];
    const slots = await DB.Schedule.find({ webinarId: webinar._id }).exec();
    if (slots && slots.length > 0) {
      await Promise.all(
        slots.map(async slot => {
          let checkOverlap = await Service.Booking.checkOverlapSlot({
            userId: req.user._id,
            startTime: slot.startTime.toISOString(),
            toTime: slot.toTime.toISOString()
          });

          if (!moment.utc().add(30, 'minutes').isAfter(moment.utc(slot.startTime)) && !checkOverlap) {
            overlapSlots.push(slot);
          }
        })
      );
    }
    res.locals.overlapSlots = {
      overlapSlots
    };
    return next();
  } catch (e) {
    next();
  }
};

exports.transactionOfTutor = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['targetType', 'userId', 'tutorId', 'targetId', 'status'],
      text: ['code', 'description']
    });
    let excludeFields = {};
    if (req.user.role !== 'admin') {
      excludeFields = { commission: 0, balance: 0, vat: 0, paymentInfo: 0 };
      query.tutorId = req.user._id;
    }
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Transaction.count(query);
    let items = await DB.Transaction.find(query, excludeFields)
      .populate({ path: 'user', select: '_id name username' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    items = await Promise.all(
      items.map(async item => {
        let target = null;
        let subject = null;
        if (item.targetId) {
          if (item.targetType === 'webinar') {
            target = await DB.Webinar.findOne({ _id: item.targetId }, { name: 1, alias: 1 });
          } else if (item.targetType === 'course') {
            target = await DB.Course.findOne({ _id: item.targetId }, { name: 1, alias: 1 });
          } else if (item.targetType === 'subject') {
            target = await DB.MyTopic.findOne({ _id: item.targetId }, { name: 1, alias: 1, mySubjectId: 1 });
            if (!target) {
              target = await DB.MySubject.findOne({ _id: item.targetId }, { name: 1, alias: 1 });
            } else if (target && target.mySubjectId) {
              subject = await DB.MySubject.findOne({ _id: target.mySubjectId }, { name: 1, alias: 1 });
            }
          }
        }
        const data = item.toObject();
        data[item.targetType] = target;
        data.tutorSubject = subject;
        return data;
      })
    );
    res.locals.listOfTutor = {
      count,
      items
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.myCourse = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['description'],
      equal: ['userId', 'targetId']
    });
    const type = 'course';
    if (!type) {
      return next(PopulateResponse.validationError());
    }
    query.targetType = type;
    if (req.user) {
      query.userId = req.user._id;
    }

    const selectData =
      type === 'tutor'
        ? { path: 'tutor', select: 'name avatarUrl username country featured ratingAvg totalRating avatar' }
        : type === 'webinar'
        ? {
            path: 'webinar',
            select: 'name tutorId mainImageId featured lastSlot price description alias',
            populate: [
              {
                path: 'mainImage'
              },
              {
                path: 'tutor',
                select: 'name avatarUrl username country featured ratingAvg totalRating avatar'
              }
            ]
          }
        : {
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
    const count = await DB.Transaction.count(query);
    const items = await DB.Transaction.find(query)
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
        itemsCheckFavorite = await Service.Payment.isBooked(items, req.user._id);
        break;
    }
    res.locals.list = { count, items: itemsCheckFavorite };
    next();
  } catch (e) {
    return next(e);
  }
};
