const moment = require('moment');

async function sendAlert(beforeTimeInMinute = 60) {
  try {
    const startTime = moment()
      .add(-1 * beforeTimeInMinute, 'minutes')
      .toDate();
    const query = {
      visible: true,
      startTime: {
        $lte: moment()
          .add(1 * beforeTimeInMinute, 'minutes')
          .toDate()
      },
      status: {
        $in: ['pending', 'booked']
      },
      paid: true
    };
    const flag = `meta.sendNotifications.before.${beforeTimeInMinute}`;
    query[flag] = { $ne: true };
    const appointments = await DB.Appointment.find(query);
    if (appointments.length) {
      await Promise.all(
        appointments.map(async appointment => {
          if (
            moment().isSameOrBefore(moment(appointment.startTime)) &&
            moment().isSameOrAfter(
              moment(appointment.startTime)
                .add(-1 * beforeTimeInMinute, 'minutes')
                .toDate()
            )
          ) {
            const in1Hour = moment().isSameOrAfter(
              moment(appointment.startTime)
                .add(-1 * 60, 'minutes')
                .toDate()
            );
            if (beforeTimeInMinute > 60 && in1Hour) {
              const updateNotifyAlert = {};
              updateNotifyAlert[flag] = true;
              await DB.Appointment.update(
                { _id: appointment._id },
                {
                  $set: updateNotifyAlert
                }
              );
            } else {
              await Service.Appointment.sendNotify(appointment._id);
              const updateNotifyAlert = {};
              updateNotifyAlert[flag] = true;
              await DB.Appointment.update(
                { _id: appointment._id },
                {
                  $set: updateNotifyAlert
                }
              );
            }
          }
        })
      );
      // const updateNotifyAlert = {};
      // updateNotifyAlert[flag] = true;
      // await Promise.all(
      //   appointments.map(appointment =>
      //     DB.Appointment.update(
      //       { _id: appointment._id },
      //       {
      //         $set: updateNotifyAlert
      //       }
      //     )
      //   )
      // );
    }
  } catch (e) {
    await Service.Logger.create({
      path: 'notify-appointment',
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
    await sendAlert(60);
    // 8h
    await sendAlert(480);
    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      path: 'notify-appointment',
      error: e
    });
    done();
  }
};
