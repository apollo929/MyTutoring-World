const Stripe = require('stripe');
const Joi = require('joi');

exports.hook = async (req, res, next) => {
  try {
    const data = req.body;
    const eventType = data.type;

    if (data.id && data.data && data.data.object) {
      const object = data.data.object;
      const transaction = await DB.Transaction.findOne({ _id: object.metadata.transactionId });
      if (!transaction) return next();
      if (eventType === 'charge.succeeded') {
        transaction.paymentInfo = object;
        await transaction.save();
        await Service.Payment.updatePayment(transaction._id);
      }
      if (eventType === 'account.updated') {
        const tutor = await DB.User.findOne({ accountStripeId: object.id });
        if (!tutor) return next();
        tutor.stripePayoutsEnabled = object.payouts_enabled;
        tutor.stripeDetailsSubmitted = object.details_submitted;
        tutor.stripeChargesEnabled = object.charges_enabled;
        await tutor.save();
      }
    }
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    const validateSchema = Joi.object()
      .keys({
        email: Joi.string().required(),
        type: Joi.string().required(),
        country: Joi.string().required(),
        business_type: Joi.string().required()
      })
      .unknown();
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (req.user.type !== 'tutor') {
      return next(PopulateResponse.error({ message: 'You can not connect with us!' }));
    }
    if (req.user.accountStripeId) {
      const stripeAccount = await Service.Stripe.getDetailAccount(req.user.accountStripeId);
      if (stripeAccount.id) return next(PopulateResponse.error({ message: 'You are already connected with us.' }));
    }
    const data = await await Service.Stripe.createAccount(validate.value);
    if (data.id) {
      await DB.User.update(
        { _id: req.user._id },
        {
          accountStripeId: data.id,
          accountStripeType: data.type,
          stripePayoutsEnabled: data.payouts_enabled,
          stripeDetailsSubmitted: data.details_submitted,
          stripeChargesEnabled: data.charges_enabled
        }
      );
    }
    res.locals.create = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const deleted = await Service.Stripe.deleteAccount({ accountId: req.params.id });
    res.locals.delete = deleted;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({}).unknown();
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const updated = await Service.Stripe.updateAccount(req.params.id, validate.value);
    res.locals.update = updated;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.createAccountLink = async (req, res, next) => {
  try {
    const validateSchema = Joi.object()
      .keys({
        accountId: Joi.string().required()
      })
      .unknown();
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const data = await await Service.Stripe.createAccountLink(req.body);
    if (data.url) {
      await DB.User.update(
        { _id: req.user._id },
        {
          accountStripeId: validate.value.accountId
        }
      );
    }
    res.locals.createLink = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.createBankTok = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({}).unknown();
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const data = await await Service.Stripe.createBankTok(validate.value);
    res.locals.createBankTok = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.createBankAccount = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      bankTok: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const data = await Service.Stripe.createBankAccount(req.params.id, validate.value);
    if (data.id) {
      const externalAccountId = data.type === 'bank_account' ? { bankId: data.id } : { cardId: data.id };
      const stripeAccount = new DB.Stripe(
        Object.assign(
          {
            type: data.type,
            accountId: data.account,
            tutorId: req.user._id
          },
          externalAccountId
        )
      );
      await stripeAccount.save();
    }
    res.locals.createBank = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.createCardAccount = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      cardTok: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const data = await await Service.Stripe.createBankAccount(validate.value);
    res.locals.createCard = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.acceptance = async (req, res, next) => {
  try {
    const data = await await Service.Stripe.acceptance(req.params.id, { remoteAddress: req.connection.remoteAddress });
    res.locals.acceptance = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.getDetailAccount = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return next(PopulateResponse.error({ message: 'Missing params id' }));
    }
    const data = await await Service.Stripe.getDetailAccount(req.params.id);
    res.locals.detail = data;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.checkStatusAccount = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return next(PopulateResponse.error({ message: 'Missing params id' }));
    }
    const data = await Service.Stripe.getDetailAccount(req.params.id);
    if (data.id) {
      await DB.User.update(
        { _id: req.user._id },
        {
          accountStripeType: data.type,
          stripePayoutsEnabled: data.payouts_enabled,
          stripeDetailsSubmitted: data.details_submitted,
          stripeChargesEnabled: data.charges_enabled
        }
      );
    }
    const resp = {
      charges_enabled: data.charges_enabled,
      details_submitted: data.details_submitted,
      payouts_enabled: data.payouts_enabled
    };
    res.locals.status = resp;
    return next();
  } catch (error) {
    return next(error);
  }
};
