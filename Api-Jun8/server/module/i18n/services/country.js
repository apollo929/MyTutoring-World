const request = require('request');

exports.getCountryByIp = async (ip) => {
  try {
    return new Promise((resolve, reject) => request(
      {
        method: 'GET',
        uri: `http://ip-api.com/json/${ip}`
      },
      (err, response, body) => {
        if (err) {
          return reject(err);
        }

        const data = JSON.parse(body);
        if (data.error) {
          return reject(data);
        }
        return resolve(data);
      }
    ));
  } catch (e) {
    throw e;
  }
};
