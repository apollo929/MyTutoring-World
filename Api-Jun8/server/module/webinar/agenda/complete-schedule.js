const moment = require('moment');
const url = require('url');
/**
 * Fake service!
 * Do complete cause we did not setup callhook yet
 */
module.exports = async (job, done) => {
  try {
    const slots = await DB.Schedule.find({
      $or: [{ status: 'scheduled' }, { status: 'pending' }],
      startTime: {
        $lt: moment().add(-1, 'hours')
      },
      type: 'webinar'
    });
    await Promise.all(
      slots.map(async slot => {
        // await Service.Appointment.complete(slot);
        const tutor = await DB.User.findOne({ _id: slot.tutorId });
        const webinar = await DB.Webinar.findOne({ _id: slot.webinarId });
        if (!tutor || !webinar) {
          slot.status = 'canceled';
          await slot.save();
          // throw new Error('Tutor or webinar not found');
        }

        if (tutor.notificationSettings)
          await Service.Mailer.send('review/notify-review-tutor.html', tutor.email, {
            subject: `Reservation ${(webinar && webinar.name) || ''} has been completed`,
            webinar: webinar.toObject(),
            slot: slot.toObject(),
            tutor: tutor.getPublicProfile(),
            // user: user.getPublicProfile(),
            reviewLink: url.resolve(process.env.userWebUrl, `users/appointments`)
          });
        slot.status = 'completed';
        await slot.save();
      })
    );
    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      path: 'complete-schedule',
      error: e
    });
    done();
  }
};
