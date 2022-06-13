const Joi = require('joi');

exports.request = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      transactionId: Joi.string().required(),
      reason: Joi.string().required(),
      targetType: Joi.string().required(),
      type: Joi.string()
        .allow([null, ''])
        .when('targetType', {
          is: 'webinar' || 'subject',
          then: Joi.required(),
          otherwise: Joi.optional()
        })
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const data = await Service.RefundRequest.sendRequest(req.user._id, validate.value);
    res.locals.request = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      note: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const refundRequest = await DB.RefundRequest.findOne({ _id: req.params.refundRequestId });
    if (!refundRequest) {
      return next(PopulateResponse.notFound());
    }
    await Service.RefundRequest.approveRequest(refundRequest, validate.value);
    res.locals.approve = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      rejectReason: Joi.string().required(),
      note: Joi.string().allow([null, '']).optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const refundRequest = await DB.RefundRequest.findOne({ _id: req.params.refundRequestId });
    if (!refundRequest) {
      return next(PopulateResponse.notFound());
    }
    await Service.RefundRequest.rejectRequest(refundRequest, validate.value);
    res.locals.reject = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.confirmRefunded = async (req, res, next) => {
  const refundRequest = await DB.RefundRequest.findOne({ _id: req.params.refundRequestId });
  if (!refundRequest) {
    return next(PopulateResponse.notFound());
  }
  await Service.RefundRequest.confirmRefunded(refundRequest);
  res.locals.confirm = { success: true };
  return next();
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['userId', 'status'],
      text: ['code']
    });
    const sort = Helper.App.populateDBSort(req.query);

    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const count = await DB.RefundRequest.count(query);
    let items = await DB.RefundRequest.find(query)
      .populate({ path: 'user', select: '_id name username paypalEmailId' })
      .populate({ path: 'tutor', select: '_id name username' })
      .populate('appointment')
      .populate({ path: 'transaction', select: req.user.role !== 'admin' ? '-commission -balance' : '' })
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    items = await Promise.all(
      items.map(async item => {
        let target = null;
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

exports.findOne = async (req, res, next) => {
  try {
    const refundRequest = await DB.RefundRequest.findOne({ _id: req.params.refundRequestId })
      .populate({ path: 'user', select: '_id name username paypalEmailId' })
      .populate({ path: 'tutor', select: '_id name username' })
      .populate('appointment')
      .populate({ path: 'transaction', select: req.user.role !== 'admin' ? '-commission -balance' : '' })
      .populate({ path: 'webinar', select: '_id name alias price' })
      .populate({ path: 'subject', select: '_id name alias price' })
      .populate({ path: 'course', select: '_id name alias price' });
    if (!refundRequest) {
      return next(PopulateResponse.notFound());
    }
    if (req.user.role !== 'admin' && refundRequest.userId.toString() !== req.user._id.toString()) {
      return next(PopulateResponse.forbbiden());
    }

    let target = null;
    const targetType = refundRequest.targetType;
    if (refundRequest.targetId) {
      if (targetType === 'webinar') {
        target = await DB.Webinar.findOne({ _id: refundRequest.targetId }, { name: 1, alias: 1 });
      } else if (targetType === 'course') {
        target = await DB.Course.findOne({ _id: refundRequest.targetId }, { name: 1, alias: 1 });
      } else if (targetType === 'subject') {
        target = await DB.MyTopic.findOne({ _id: refundRequest.targetId }, { name: 1, alias: 1, mySubjectId: 1 });
        if (!target) {
          target = await DB.MySubject.findOne({ _id: refundRequest.targetId }, { name: 1, alias: 1 });
        } else if (target && target.mySubjectId) {
          subject = await DB.MySubject.findOne({ _id: target.mySubjectId }, { name: 1, alias: 1 });
        }
      }
    }
    const data = refundRequest.toObject();
    data[targetType] = target;

    res.locals.refundRequest = data;
    return next();
  } catch (e) {
    return next();
  }
};
