/* eslint global-require:0, import/no-dynamic-require:0 */

const express = require('express');

const USE_HTTP_ERROR = false;

module.exports = request => ({
  hookRoute(path) {
    const router = express.Router();
    require(path)(router);
    return router;
  },

  login: (uid, password) =>
    request.post('/v1/auth/login').send({
      email: uid,
      password
    }).expect(200)
      .then(res => res.body.token)
      .catch(err => Promise.reject(err)),

  request(verb, url, token, body, expectationCode, responseField) {
    const newVerb = verb.toLowerCase();
    let req = request[verb](url);
    if (token) {
      req = req.set('Authorization', `Bearer ${token}`);
    }
    let httpStatusCode = expectationCode;
    if (!USE_HTTP_ERROR && !expectationCode) {
      httpStatusCode = 200;
    }
    if (newVerb === 'get') {
      return req.expect(httpStatusCode || 200)
        .then((res) => {
          if (!USE_HTTP_ERROR) {
            expect(res.body.code).to.equal(expectationCode || 200);
            return res[responseField || 'body'].data;
          }
          return res[responseField || 'body'];
        })
        .catch(e => console.log(e));
    }

    return req.send(body || {})
      .expect(httpStatusCode || 200)
      .then((res) => {
        if (!USE_HTTP_ERROR) {
          expect(res.body.code).to.equal(expectationCode || 200);
          return res.body.data;
        }

        return res.body;
      });
  },

  pureRequest(verb, url, token, body) {
    let req = request[verb](url);
    if (token) {
      req = req.set('Authorization', `Bearer ${token}`);
    }

    return req.send(body || {})
      .then(res => res.body);
  }
});
