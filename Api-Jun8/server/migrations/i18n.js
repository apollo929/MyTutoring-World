/* eslint import/no-extraneous-dependencies: 0, no-restricted-syntax: 0, no-await-in-loop: 0 */

const langs = ['en', 'es'];
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  try {
    await DB.I18nLanguage.remove();
    await DB.I18nText.remove();
    await DB.I18nTranslation.remove();

    await DB.I18nLanguage.create({
      key: 'en',
      name: 'EN',
      isDefault: true,
      isActive: true,
      flag: process.env.baseUrl + 'flags/us.svg'
    });

    // add text from en.json file to i18n text
    // then get translation
    const enFile = path.join(__dirname, 'translation', 'en.json');
    const enSourceData = fs.readFileSync(enFile, { encoding: 'utf-8' });
    const jsonData = JSON.parse(enSourceData);
    const keys = Object.keys(jsonData);
    const textMapping = {};
    for (const key of keys) {
      const i18nText = new DB.I18nText({
        text: key
      });
      await i18nText.save();
      textMapping[key] = i18nText;
    }

    for (const lang of langs) {
      const targetFile = path.join(__dirname, 'translation', `${lang}.json`);
      if (fs.existsSync(targetFile)) {
        const targetData = fs.readFileSync(targetFile, { encoding: 'utf-8' });
        const targetJson = JSON.parse(targetData);
        const targetKeys = Object.keys(targetJson);
        for (const targetKey of targetKeys) {
          const i18Translation = new DB.I18nTranslation({
            lang,
            textId: textMapping[targetKey] ? textMapping[targetKey]._id : null,
            text: targetKey,
            translation: targetJson[targetKey]
          });

          await i18Translation.save();
        }
      }
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
