const Joi = require('joi');
const _ = require('lodash');

const validateSchema = Joi.object().keys({
  type: Joi.string().allow(['paypal', 'bank-account']).required(),
  paypalAccount: Joi.string().allow([null, '']).when('type', {
    is: 'paypal',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  accountHolderName: Joi.string().allow([null, '']),
  accountNumber: Joi.number().allow([null, '']),
  iban: Joi.number().allow([null, '']),
  bankName: Joi.string().allow([null, '']),
  bankAddress: Joi.string().allow([null, '']),
  sortCode: Joi.string().allow([null, '']),
  routingNumber: Joi.number().allow([null, '']),
  swiftCode: Joi.string().allow([null, '']),
  ifscCode: Joi.string().allow([null, '']),
  routingCode: Joi.string().allow([null, ''])
});

exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const payoutAccount = new DB.PayoutAccount(
      Object.assign(validate.value, {
        userId: req.user._id,
        tutorId: req.user.tutorId
      })
    );
    await payoutAccount.save();
    res.locals.create = payoutAccount;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const payoutAccount = await DB.PayoutAccount.findOne({
      _id: req.params.payoutAccountId
    });
    if (!payoutAccount) {
      return next(PopulateResponse.notFound());
    }

    req.payoutAccount = payoutAccount;
    res.locals.payoutAccount = payoutAccount;
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
    _.merge(req.payoutAccount, validate.value);
    await req.payoutAccount.save();
    res.locals.update = req.payoutAccount;
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
      equal: ['type']
    });
    const sort = Helper.App.populateDBSort(req.query);
    query.userId = req.user._id;
    const count = await DB.PayoutAccount.count(query);
    const items = await DB.PayoutAccount.find(query)
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

exports.remove = async (req, res, next) => {
  try {
    req.payoutAccount.remove();
    res.locals.remove = { success: true };
    next();
  } catch (e) {
    next(e);
  }
};
