const moment = require('moment');
const request = require('request');
const countryCurrencyMap = require('../data/country-currency.json');
const currencyMap = require('../data/currency.json');

exports.getCurrencyByCode = (isoCode) => {
  const code = isoCode.toUpperCase();
  return currencyMap[code] || null;
};

exports.getCurrencyByCountryCode = (isoCode) => {
  const code = isoCode.toUpperCase();
  const currency = countryCurrencyMap[code];
  if (!currency) {
    return null;
  }
  return currencyMap[currency];
};

/**
 * get currency rate from source currency to target currency
 * @param {String} source
 * @param {String} target
 */
exports.getRate = async (source, target) => {
  try {
    // https://free.currencyconverterapi.com/
    const q = `${source.toUpperCase()}_${target.toUpperCase()}`;

    // check DB for this rate, if it is over 1 day. update it
    let currencyRate = await DB.CurrencyRate.findOne({ source, target });
    if (currencyRate && moment().add(-1, 'days').isBefore(currencyRate.updatedAt)) {
      return currencyRate.rate;
    } else if (!currencyRate) {
      currencyRate = new DB.CurrencyRate({ source, target });
    }

    const uri = `http://free.currencyconverterapi.com/api/v5/convert?q=${q}&compact=y`;
    return new Promise((resolve, reject) => request(
      {
        method: 'GET',
        uri
      },
      async (err, response, body) => {
        if (err) {
          return reject(err);
        }

        const data = JSON.parse(body);
        if (!data[q]) {
          return reject('No currency found');
        }

        currencyRate.rate = data[q].val;
        currencyRate.updatedAt = new Date();
        await currencyRate.save();
        return resolve(data[q].val);
      }
    ));
  } catch (e) {
    throw e;
  }
};
