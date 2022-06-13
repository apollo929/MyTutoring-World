exports.model = {
  I18nLanguage: require('./models/i18n-language'),
  I18nText: require('./models/i18n-text'),
  I18nTranslation: require('./models/i18n-translation'),
  CurrencyRate: require('./models/currency-rate')
};

exports.router = (router) => {
  require('./routes/language.route')(router);
  require('./routes/text.route')(router);
  require('./routes/translation.route')(router);
};

exports.services = {
  Currency: require('./services/currency'),
  Country: require('./services/country')
};
