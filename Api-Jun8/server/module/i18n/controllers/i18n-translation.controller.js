const Joi = require('joi');

exports.create = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      lang: Joi.string().required(),
      textId: Joi.string().required(),
      translation: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const count = await DB.I18nTranslation.findOne({
      textId: validate.value.textId,
      lang: validate.value.lang
    });
    if (count) {
      return next(
        PopulateResponse.error({
          message: 'Translation has been exist'
        })
      );
    }
    const text = await DB.I18nText.findOne({ _id: validate.value.textId });
    if (!text) {
      return next(
        PopulateResponse.notFound({
          message: 'Text not found'
        })
      );
    }
    const data = new DB.I18nTranslation(validate.value);
    data.text = text.text;
    await data.save();

    res.locals.create = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const validateSchema = Joi.object().keys({
      translation: Joi.string().required()
    });
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const data = await DB.I18nTranslation.findOne({ _id: req.params.translationId });
    if (!data) {
      return next(PopulateResponse.notFound());
    }
    data.translation = validate.value.translation;
    await data.save();

    res.locals.update = data;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const translation = await DB.I18nTranslation.findOne({ _id: req.params.translationId });
    if (!translation) {
      return next(PopulateResponse.notFound());
    }
    await translation.remove();

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
      text: ['text', 'translation'],
      equal: ['lang']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.I18nTranslation.count(query);
    const items = await DB.I18nTranslation.find(query)
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

exports.pull = async (req, res, next) => {
  try {
    // pull the text to translation
    const text = await DB.I18nText.find();
    // const textMapping = text.map(t => t.text);
    await Promise.all(
      text.map(t =>
        DB.I18nTranslation.count({
          text: t.text,
          lang: req.params.lang
        }).then(count => {
          if (!count) {
            return DB.I18nTranslation.create({
              text: t.text,
              translation: t.text,
              lang: req.params.lang
            });
          }

          return true;
        })
      )
    );

    res.locals.pull = { success: true };
    next();
  } catch (e) {
    next(e);
  }
};

exports.sendJSON = async (req, res, next) => {
  try {
    // TODO - check activated languages
    const data = await DB.I18nTranslation.find({ lang: req.params.lang });
    const items = data.length
      ? Object.assign(
          ...data.map(item => {
            const response = {};
            response[item.text] = item.translation;
            return response;
          })
        )
      : {};

    res.status(200).send(items);
  } catch (e) {
    next(e);
  }
};
