const Joi = require('joi');
const _ = require('lodash');

exports.register = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      email: Joi.string().required(),
      name: Joi.string()
        .allow([null, ''])
        .optional(),
      address: Joi.string()
        .allow([null, ''])
        .optional()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    let contact = await DB.Contact.findOne({ email: validate.value.email });
    if (!contact) {
      contact = new DB.Contact(validate.value);
    }

    _.merge(contact, validate.value);
    await contact.save();
    res.locals.register = { success: true };
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
      text: ['name', 'email']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Contact.count(query);
    const items = await DB.Contact.find(query)
      // .collation({ locale: 'en' })
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

exports.remove = async (req, res, next) => {
  try {
    await DB.Contact.remove({ _id: req.params.contactId });
    res.locals.remove = { success: true };
    next();
  } catch (e) {
    next(e);
  }
};
