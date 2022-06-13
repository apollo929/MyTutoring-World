const moment = require('moment');

/**
 * Fake service!
 * Do complete cause we did not setup callhook yet
 */
module.exports = async (job, done) => {
  try {
    const appointments = await DB.Appointment.find({
      $or: [{ status: 'pending' }, { status: 'booked' }]
    });
    if (appointments && appointments.length > 0) {
      await Promise.all(
        appointments.map(async appointment => {
          if (moment().isAfter(moment(appointment.toTime).toDate())) {
            await Service.Appointment.checkNotStart(appointment);
          }
        })
      );
    }
    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      path: 'check-not-start-appointment',
      error: e
    });
    done();
  }
};
