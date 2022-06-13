const Joi = require('joi');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const validateSchema = Joi.object().keys({
  key: Joi.string().required(),
  name: Joi.string().required(),
  flag: Joi.string().required(),
  isDefault: Joi.boolean().allow([null]).optional(),
  isActive: Joi.boolean().allow([null]).optional(),
  jsonId: Joi.string().allow([null, '']).optional(),
  countryCode: Joi.string().allow([null, '']).optional()
});
exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const count = await DB.I18nLanguage.findOne({ key: validate.value.key });
    if (count) {
      return next(
        PopulateResponse.error({
          message: 'Key has been exist'
        })
      );
    }
    const language = new DB.I18nLanguage(validate.value);
    language.flag = new URL(`flags-png/${language.countryCode.toLowerCase()}.png`, process.env.baseUrl).href;
    await language.save();

    if (language.isDefault) {
      await DB.I18nLanguage.updateMany(
        {
          _id: { $ne: language._id }
        },
        {
          $set: {
            isDefault: false
          }
        }
      );
    }

    if (language.jsonId) {
      const file = await DB.Media.findOne({ _id: language.jsonId });
      if (file) {
        const textMapping = {};
        const targetFile = path.join(__dirname, '../../../../public/files', file.name);
        if (fs.existsSync(targetFile)) {
          const targetData = fs.readFileSync(targetFile, { encoding: 'utf-8' });
          const targetJson = JSON.parse(targetData);
          const targetKeys = Object.keys(targetJson);
          //  console.log(targetKeys[0]);
          for (const targetKey of targetKeys) {
            let i18nText = await DB.I18nText.findOne({
              text: targetKey
            });
            if (!i18nText) {
              i18nText = new DB.I18nText({
                text: targetKey
              });
            }
            textMapping[targetKey] = i18nText;
            const i18Translation = new DB.I18nTranslation({
              lang: language.key,
              textId: textMapping[targetKey] ? textMapping[targetKey]._id : null,
              text: targetKey,
              translation: targetJson[targetKey]
            });

            await i18Translation.save();
          }
        }
      }
    }

    res.locals.create = language;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    //  console.log(req.body);
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const language = await DB.I18nLanguage.findOne({ _id: req.params.languageId });
    const oldKey = language.key;
    if (!language) {
      return next(PopulateResponse.notFound());
    }
    _.merge(language, validate.value);
    language.flag = new URL(`flags-png/${language.countryCode.toLowerCase()}.png`, process.env.baseUrl).href;
    await language.save();

    if (language.isDefault) {
      await DB.I18nLanguage.updateMany(
        {
          _id: { $ne: language._id }
        },
        {
          $set: {
            isDefault: false
          }
        }
      );
    }

    if (oldKey !== language.key) {
      await DB.I18nTranslation.updateMany(
        {
          lang: oldKey
        },
        {
          lang: language.key
        }
      );
    }

    if (language.jsonId) {
      const file = await DB.Media.findOne({ _id: language.jsonId });
      if (file) {
        await DB.I18nTranslation.deleteMany({
          lang: language.key
        });
        const textMapping = {};
        const targetFile = path.join(__dirname, '../../../../public/files', file.name);
        if (fs.existsSync(targetFile)) {
          const targetData = fs.readFileSync(targetFile, { encoding: 'utf-8' });
          const targetJson = JSON.parse(targetData);
          const targetKeys = Object.keys(targetJson);
          for (const targetKey of targetKeys) {
            let i18nText = await DB.I18nText.findOne({
              text: targetKey
            });
            if (!i18nText) {
              i18nText = new DB.I18nText({
                text: targetKey
              });
            }
            textMapping[targetKey] = i18nText;
            const i18Translation = new DB.I18nTranslation({
              lang: language.key,
              textId: textMapping[targetKey] ? textMapping[targetKey]._id : null,
              text: targetKey,
              translation: targetJson[targetKey]
            });

            await i18Translation.save();
          }
        }
      }
    }

    res.locals.update = language;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const language = await DB.I18nLanguage.findOne({ _id: req.params.languageId });
    if (!language) {
      return next(PopulateResponse.notFound());
    }
    await language.remove();
    await DB.I18nTranslation.deleteMany({
      lang: language.key
    });

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
    const query = {};
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
    }

    const count = await DB.I18nLanguage.count(query);
    const items = await DB.I18nLanguage.find(query);

    res.locals.list = { count, items };
    next();
  } catch (e) {
    next(e);
  }
};
