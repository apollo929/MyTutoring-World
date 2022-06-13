async function sendAlert(beforeTimeInMinute = 60) {
  try {
    await Service.Schedule.notifyForTutor(beforeTimeInMinute);
  } catch (e) {
    await Service.Logger.create({
      path: 'notify-schedule',
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
      path: 'notify-schedule',
      error: e
    });
    done();
  }
};
