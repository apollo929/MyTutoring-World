const url = require('url');
async function sendAlert(beforeTimeInMinute = 60) {
  try {
    const query = {
      type: 'gift',
      paid: true,
      isRemindRecipient: false,
      targetType: 'webinar'
    };
    const transactions = await DB.Transaction.find(query);
    if (transactions && transactions.length > 0) {
      transactions.map(async transaction => {
        const user = await DB.User.findOne({ _id: transaction.userId });
        // if (!user) {
        //   throw new Error('Cannot found user');
        // }
        const tutor = await DB.User.findOne({ _id: transaction.tutorId });
        // if (!tutor) {
        //   throw new Error('Cannot found tutor');
        // }
        const topic = await DB.Topic.findOne({ _id: transaction.targetId });
        // if (!topic) {
        //   throw new Error('Cannot found topic');
        // }
        const recipient = await DB.User.findOne({
          email: transaction.emailRecipient
        });
        if (!recipient && topic && tutor && user) {
          await Service.Mailer.send('appointment/send-gift.html', transaction.emailRecipient, {
            subject: `${user.name} give you a gift`,
            user: user.getPublicProfile(),
            tutor: tutor.getPublicProfile(),
            transaction: transaction.toObject(),
            topic: topic.toObject(),
            signupLink: url.resolve(process.env.userWebUrl, `/auth/signup`),
            appName: process.env.APP_NAME
          });
          await Service.Mailer.send('appointment/remind-gift.html', user.email, {
            subject: `[Notification] Remind your friend`,
            transaction: transaction.toObject(),
            tutor: tutor.getPublicProfile(),
            user: user.getPublicProfile(),
            topic: topic.toObject()
          });
        }
        await DB.Transaction.update(
          { _id: transaction._id },
          {
            $set: {
              isRemindRecipient: true
            }
          }
        );
      });
    }
  } catch (e) {
    await Service.Logger.create({
      path: 'notify-gift',
      type: 'error',
      error: e
    });
    throw e;
  }
}

/**
 * notify appointment before 30m and before 8h
 */
module.exports = async (job, done) => {
  try {
    await sendAlert(480);
    await sendAlert(60);
    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      path: 'notify-gift',
      error: e
    });
    done();
  }
};
