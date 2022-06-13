const request = require('request');

exports.getProfile = async (accessToken) => {
  try {
    return new Promise((resolve, reject) => request(
      {
        method: 'GET',
        uri: `https://www.googleapis.com/plus/v1/people/me?access_token=${accessToken}`
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
