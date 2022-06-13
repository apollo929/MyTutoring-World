const Joi = require('joi');
const moment = require('moment');

exports.request = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      payoutAccountId: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const payoutAccount = await DB.PayoutAccount.findOne({
      _id: req.body.payoutAccountId
    });
    if (!payoutAccount) {
      return next(PopulateResponse.notFound());
    }

    const data = await Service.PayoutRequest.sendRequest(req.user._id, payoutAccount);
    res.locals.request = data;
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
    await Service.PayoutRequest.rejectRequest(req.params.requestId, validate.value);
    res.locals.reject = { success: true };
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
    await Service.PayoutRequest.approveRequest(req.params.requestId, validate.value);
    res.locals.approve = { success: true };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
    const take = parseInt(req.query.take, 10) || 10;
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['type', 'tutorId', 'status'],
      text: ['code']
    });
    const sort = Helper.App.populateDBSort(req.query);

    if (req.query.startDate && req.query.toDate) {
      query.createdAt = {
        $gte: moment(req.query.startDate).toDate(),
        $lte: moment(req.query.toDate).add(1, 'days').toDate()
      };
    }

    if (req.user.role !== 'admin') {
      query.tutorId = req.user._id;
    }

    const count = await DB.PayoutRequest.count(query);
    const items = await DB.PayoutRequest.find(query)
      .populate('tutor')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
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
    const payoutRequest = await DB.PayoutRequest.findOne({ _id: req.params.requestId }).populate('tutor');
    if (!payoutRequest) {
      return next(PopulateResponse.notFound());
    }
    if (req.user.role !== 'admin' && payoutRequest.tutorId.toString() !== req.user._id.toString()) {
      return next(PopulateResponse.forbbiden());
    }

    const data = payoutRequest.toObject();
    data.items = await Service.PayoutRequest.getItemDetails(payoutRequest._id);
    // load details order of this item
    res.locals.payoutRequest = data;
    return next();
  } catch (e) {
    return next();
  }
};
