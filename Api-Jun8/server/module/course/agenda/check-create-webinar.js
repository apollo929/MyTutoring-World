const moment = require('moment');

async function sendAlert(beforeTimeInMinute = 30) {
  try {
    const startTime = moment().add(-1 * beforeTimeInMinute, 'minutes').toDate();
    const query = {
      startTime: {
        $gte: startTime
      }
    };
    const slots = await DB.Schedule.find(query);
    if (slots.length) {
      await Promise.all(slots.map(slot => Service.Schedule.createWebinar(slot)));
    }
  } catch (e) {
    await Service.Logger.create({
      path: 'create-webinar',
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
    await sendAlert(30);
    // 8h
    await sendAlert(480);
    done();
  } catch (e) {
    await Service.Logger.create({
      level: 'error',
      path: 'create-webinar',
      error: e
    });
    done();
  }
};
