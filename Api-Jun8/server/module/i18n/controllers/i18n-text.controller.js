const Joi = require('joi');

const validateSchema = Joi.object().keys({
  text: Joi.string().required()
});

exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const count = await DB.I18nText.findOne({ text: validate.value.text });
    if (count) {
      return next(
        PopulateResponse.error({
          message: 'Text has been exist'
        })
      );
    }
    const data = new DB.I18nText(validate.value);
    await data.save();

    res.locals.create = data;
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

    const text = await DB.I18nText.findOne({ _id: req.params.textId });
    if (!text) {
      return next(PopulateResponse.notFound());
    }
    const count = await DB.I18nText.findOne({ text: validate.value.text });
    if (count) {
      return next(
        PopulateResponse.error({
          message: 'Text has been exist'
        })
      );
    }
    text.text = validate.value.text;
    await text.save();
    await DB.I18nTranslation.updateMany(
      { textId: text._id },
      {
        $set: { text: text.text }
      }
    );

    res.locals.update = text;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const text = await DB.I18nText.findOne({ _id: req.params.textId });
    if (!text) {
      return next(PopulateResponse.notFound());
    }
    await text.remove();
    await DB.I18nTranslation.remove({ textId: text._id });

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
    const query = Helper.App.populateDbQuery(req.query, {
      text: ['text']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.I18nText.count(query);
    const items = await DB.I18nText.find(query)
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
    next();
  }
};
