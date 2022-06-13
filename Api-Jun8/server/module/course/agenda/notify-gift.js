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
        const webinar = await DB.Webinar.findOne({ _id: transaction.targetId });
        // if (!webinar) {
        //   throw new Error('Cannot found webinar');
        // }
        const recipient = await DB.User.findOne({
          email: transaction.emailRecipient
        });
        if (!recipient && webinar && tutor && user) {
          await Service.Mailer.send('appointment/send-gift.html', transaction.emailRecipient, {
            subject: `${user.name} gave you a gift`,
            user: user.getPublicProfile(),
            tutor: tutor.getPublicProfile(),
            transaction: transaction.toObject(),
            webinar: webinar.toObject(),
            signupLink: url.resolve(process.env.userWebUrl, `/auth/signup`)
          });

          if (user.notificationSettings)
            await Service.Mailer.send('appointment/remind-gift.html', user.email, {
              subject: `[Notification] Remind your friend`,
              transaction: transaction.toObject(),
              tutor: tutor.getPublicProfile(),
              user: user.getPublicProfile(),
              webinar: webinar.toObject()
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
