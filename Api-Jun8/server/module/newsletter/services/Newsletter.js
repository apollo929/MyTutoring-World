/* eslint prefer-arrow-callback: 0 */

const async = require('async');
const Queue = require('../../../kernel/services/queue');

const newsletterQ = Queue.create('newsletter');

newsletterQ.process(async (job, done) => {
  try {
    const data = job.data;
    const query = {};
    if (data.userType && data.userType !== 'newsletter') {
      query.type = data.userType;
    }

    let count = 0;
    const limit = 10;
    const totalUser = data.userType === 'newsletter' ? await DB.Contact.count() : await DB.User.count(query);
    if (!totalUser) {
      return done();
    }

    // async lib does not work with async. await. we must change it!
    return async.during(
      function check(cb) {
        return cb(null, totalUser > count);
      },
      function doFunction(cb) {
        async.waterfall(
          [
            function doQuery(queryCb) {
              if (data.userType === 'newsletter') {
                DB.Contact.find(query).skip(count).limit(limit).exec(queryCb);
              } else {
                DB.User.find(query).skip(count).limit(limit).exec(queryCb);
              }
            }
          ],
          function doSendMail(err, users) {
            count += limit;
            if (err) {
              return cb(err);
            }

            return Promise.all(
              users.map(user => {
                if (user.notificationSettings)
                  Service.Mailer.send('newsletter/default.html', user.email, {
                    subject: data.subject,
                    // TODO - filter content like replace username, etc...
                    content: data.content
                  });
              })
            )
              .then(function finished() {
                cb();
              })
              .catch(cb);
          }
        );
      },
      function executed() {
        done();
      }
    );
  } catch (e) {
    return done();
  }
});

exports.sendMail = async data => {
  try {
    return newsletterQ.createJob(data).save();
  } catch (e) {
    throw e;
  }
};
